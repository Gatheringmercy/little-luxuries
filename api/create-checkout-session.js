// Creates a Stripe Checkout Session for ONE Little Luxuries product.
// Called by the Buy button on the store. No per-product Payment Link needed.
// Env var required in Vercel project settings: STRIPE_SECRET_KEY
// (the same "Crystal Camellia Checkout" restricted key from the WunderBar
// EuroShop Stripe account — full access except sensitive operations —
// unless Diana wants a separate Stripe account for this store.)
const Stripe = require("stripe");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    res.status(500).json({ error: "Checkout is not configured yet." });
    return;
  }
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const name = String((body && body.name) || "").slice(0, 200);
  const priceCents = Math.round(Number(body && body.price_cents));
  const sku = String((body && body.sku) || "").slice(0, 80);
  if (!name || !priceCents || priceCents < 50 || priceCents > 1000000) {
    res.status(400).json({ error: "Bad product." });
    return;
  }
  // Origin comes from the storefront that called us; fall back to this
  // deployment's own host so success/cancel links stay on this store.
  const host = req.headers.host ? "https://" + req.headers.host : "https://little-luxuries.vercel.app";
  const origin = (req.headers.origin || host).replace(/\/$/, "");
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: origin + "/?paid=1",
      cancel_url: origin + "/?cancelled=1",
      shipping_address_collection: { allowed_countries: ["US"] },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name, metadata: sku ? { sku } : {} },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: "Checkout failed. Please try again." });
  }
};
