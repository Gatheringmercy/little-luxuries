// Creates a Stripe Checkout Session for Little Luxuries.
// Two request shapes:
//  - Buy Now (legacy single item): {name, price_cents, sku}
//  - Cart: {items: [{sku, qty, size?, price_cents?}], gift_sku?}
//
// Cart prices are looked up in products.json ON THE SERVER — the browser
// never sets the price. A client-sent price_cents must match the item's
// listed price (or one of its size_chart prices) or the request is rejected.
// Gift SKUs come from gifts.json, cost $0, and are only allowed when the
// paid subtotal reaches gifts.json threshold_cents ($75). The gift goes to
// Stripe as a $0 line item with metadata gift=true so fulfillment knows to
// order it from CJ with the rest of the order.
//
// Env var required in Vercel project settings: STRIPE_SECRET_KEY
// (the same "Crystal Camellia Checkout" restricted key from the WunderBar
// EuroShop Stripe account — full access except sensitive operations —
// unless Diana wants a separate Stripe account for this store.)
const Stripe = require("stripe");
const fs = require("fs");
const path = require("path");

const MAX_ITEMS = 50;   // distinct lines in one order
const MAX_QTY = 99;     // units of one line
const DEFAULT_THRESHOLD_CENTS = 7500; // $75 free-gift threshold

let catalogCache = null;

function toCents(v) {
  const n = Math.round(parseFloat(v) * 100);
  return Number.isFinite(n) ? n : 0;
}

function bad(res, status, message) {
  res.status(status).json({ error: message });
}

// products.json / gifts.json ship with the function (vercel.json
// includeFiles). If the bundled copy is missing, fetch them from this
// deployment's own public files instead.
async function loadCatalog(host) {
  if (catalogCache) return catalogCache;
  const readJson = (p) => {
    try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { return null; }
  };
  let products = null;
  let gifts = null;
  const bases = [path.join(__dirname, ".."), process.cwd(), __dirname];
  for (const b of bases) {
    if (!products) products = readJson(path.join(b, "products.json"));
    if (!gifts) gifts = readJson(path.join(b, "gifts.json"));
    if (products && gifts) break;
  }
  if ((!products || !gifts) && host) {
    try {
      const base = "https://" + host;
      if (!products) {
        const r = await fetch(base + "/products.json");
        if (r.ok) products = await r.json();
      }
      if (!gifts) {
        const r = await fetch(base + "/gifts.json");
        if (r.ok) gifts = await r.json();
      }
    } catch (e) { /* fall through to the error below */ }
  }
  if (!Array.isArray(products)) throw new Error("catalog unavailable");
  catalogCache = {
    products,
    gifts: (gifts && typeof gifts === "object")
      ? gifts
      : { threshold_cents: DEFAULT_THRESHOLD_CENTS, gifts: [] },
  };
  return catalogCache;
}

// Every price a shopper can legitimately pay for this product: the listed
// price plus each size/style chart price, if the item has a chart.
function allowedPrices(product) {
  const prices = [toCents(product.price)];
  if (Array.isArray(product.size_chart)) {
    for (const row of product.size_chart) prices.push(toCents(row.price));
  }
  return prices.filter((c) => c > 0);
}

function chartPrice(product, size) {
  if (!Array.isArray(product.size_chart) || size == null) return null;
  const want = String(size).trim();
  for (const row of product.size_chart) {
    if (String(row.size).trim() === want) return toCents(row.price);
    if (String(row.size).trim().toLowerCase() === want.toLowerCase()) return toCents(row.price);
  }
  return null;
}

// Validate a cart payload against the catalog. Returns
// {lines, subtotalCents, gift} or throws {status, message}.
function resolveCart(body, catalog) {
  const items = body.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
    throw { status: 400, message: "Cart is empty." };
  }
  const bySku = new Map();
  for (const p of catalog.products) bySku.set(p.sku, p);

  // Merge duplicate lines (same SKU + size) before pricing.
  const merged = new Map();
  for (const raw of items) {
    if (!raw || typeof raw !== "object") throw { status: 400, message: "Bad cart item." };
    const sku = String(raw.sku || "").slice(0, 80);
    const qty = Number(raw.qty);
    if (!sku || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      throw { status: 400, message: "Bad cart item." };
    }
    const size = raw.size != null ? String(raw.size).slice(0, 40) : "";
    const key = sku + "|" + size;
    const prev = merged.get(key);
    if (prev) {
      prev.qty += qty;
      if (prev.qty > MAX_QTY) throw { status: 400, message: "Bad cart item." };
      if (raw.price_cents != null) prev.priceCents = raw.price_cents;
    } else {
      merged.set(key, { sku, qty, size, priceCents: raw.price_cents });
    }
  }

  const lines = [];
  let subtotalCents = 0;
  for (const it of merged.values()) {
    const product = bySku.get(it.sku);
    if (!product) throw { status: 400, message: "Unknown item in cart." };
    let unitCents;
    if (it.size) {
      unitCents = chartPrice(product, it.size);
      if (!unitCents) throw { status: 400, message: "Unknown size for item." };
      if (it.priceCents != null && Math.round(Number(it.priceCents)) !== unitCents) {
        throw { status: 400, message: "Price does not match the item." };
      }
    } else if (it.priceCents != null) {
      unitCents = Math.round(Number(it.priceCents));
      if (!allowedPrices(product).includes(unitCents)) {
        throw { status: 400, message: "Price does not match the item." };
      }
    } else {
      unitCents = toCents(product.price);
    }
    if (!unitCents || unitCents < 50 || unitCents > 1000000) {
      throw { status: 400, message: "Bad cart item." };
    }
    subtotalCents += unitCents * it.qty;
    lines.push({
      name: it.size ? product.name + " — " + it.size : product.name,
      unitCents,
      qty: it.qty,
      sku: it.sku,
    });
  }

  // Free gift: only from the gifts.json list, only when the paid subtotal
  // reaches the threshold. The gift itself is $0.
  let gift = null;
  if (body.gift_sku != null && body.gift_sku !== "") {
    const threshold = Number(
      (catalog.gifts && catalog.gifts.threshold_cents) || DEFAULT_THRESHOLD_CENTS
    );
    const list = Array.isArray(catalog.gifts && catalog.gifts.gifts)
      ? catalog.gifts.gifts
      : [];
    const match = list.find((g) => g && String(g.sku) === String(body.gift_sku));
    if (!match) throw { status: 400, message: "Unknown free gift." };
    if (subtotalCents < threshold) {
      throw { status: 400, message: "Free gift needs a $75 order." };
    }
    gift = { sku: String(match.sku), name: String(match.name || "Free gift") };
  }
  return { lines, subtotalCents, gift };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  if (!body || typeof body !== "object") body = {};

  // Origin comes from the storefront that called us; fall back to this
  // deployment's own host so success/cancel links stay on this store.
  const host = req.headers.host ? "https://" + req.headers.host : "https://little-luxuries.vercel.app";
  const origin = (req.headers.origin || host).replace(/\/$/, "");

  let lineItems;
  let sessionMeta = {};
  try {
    if (Array.isArray(body.items)) {
      // ---- Cart checkout ----
      const catalog = await loadCatalog(req.headers.host);
      const resolved = resolveCart(body, catalog);
      lineItems = resolved.lines.map((l) => ({
        price_data: {
          currency: "usd",
          product_data: { name: l.name.slice(0, 200), metadata: { sku: l.sku } },
          unit_amount: l.unitCents,
        },
        quantity: l.qty,
      }));
      if (resolved.gift) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: (resolved.gift.name + " — free gift").slice(0, 200),
              metadata: { sku: resolved.gift.sku, gift: "true" },
            },
            unit_amount: 0,
          },
          quantity: 1,
        });
        sessionMeta = { order_type: "cart", gift_sku: resolved.gift.sku };
      } else {
        sessionMeta = { order_type: "cart" };
      }
    } else {
      // ---- Buy Now (legacy single item) ----
      const name = String(body.name || "").slice(0, 200);
      const priceCents = Math.round(Number(body.price_cents));
      const sku = String(body.sku || "").slice(0, 80);
      if (!name || !priceCents || priceCents < 50 || priceCents > 1000000) {
        bad(res, 400, "Bad product.");
        return;
      }
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: { name, metadata: sku ? { sku } : {} },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ];
      sessionMeta = { order_type: "single" };
    }
  } catch (err) {
    if (err && err.status) { bad(res, err.status, err.message); return; }
    bad(res, 500, "Checkout is not available right now.");
    return;
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    res.status(500).json({ error: "Checkout is not configured yet." });
    return;
  }
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: origin + "/?paid=1",
      cancel_url: origin + "/?cancelled=1",
      shipping_address_collection: { allowed_countries: ["US"] },
      metadata: sessionMeta,
      line_items: lineItems,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: "Checkout failed. Please try again." });
  }
};
