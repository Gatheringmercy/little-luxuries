# Little Luxuries Emporium — Vercel static site (DRAFT, not live)

Built 2026-11-21. **Do NOT publish, do NOT change DNS, do NOT cancel EasyWP until Diana approves the preview.**

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The storefront. Traditional Christmas colors (red, green, gold, white), title "Little Luxuries Emporium", Diana's hero video + silent falling-diamonds/snowflakes background video, department filters + search, Buy buttons disabled with "checkout coming soon". Loads `products.json`. No explanatory descriptions under sections, per Diana 2026-11-21. |
| `products.json` | **105 real CJ Dropshipping products** from the two verified files (`affordable-christmas-gifts-cj-42-2026-11-09.csv` + `affordable-christmas-gifts-cj-63-2026-11-10.csv`). No invented products, no invented prices, no fake name-brand claims. |
| `hero.mp4` | Diana's video (12 MB), uploaded 2026-11-21 15:38 PST — Christmas store interior, "LITTLE LUXURIES EMPORIUM — Christmas gifts for everybody". |
| `bg.mp4` | Diana's second video (uploaded 2026-11-21), re-encoded silent, 1280x720 — falling diamonds and snowflakes in red/green/gold, as the background behind the whole page, like Camellia. |
| `hero-poster.jpg` | Poster frame from the hero video. |
| `vercel.json` | Static-site config (clean URLs, no server functions). |
| `counts.json` | Product counts by department. |

## Product counts (from the CSVs, not guessed)

- Clothing 25, Christmas Gifts 25, Jewelry 17, Home Gifts 11, Electronics & Gadgets 10, Shoes & Slippers 7, Kids & Toys 5, Pajamas & Loungewear 5 = **105 total**.
- **Only 2 of 105 have a picture URL in the files.** The other 103 show "Picture on the CJ product page — review before live" with a link to the CJ product page. Diana must SEE the real picture for each one before it goes live — that is the big remaining step.
- **Prices are CJ cost, not retail — all marked "price to verify".** The 63-file prices are ranges (e.g. "$0.97-12.90"). Retail markup is not set. Verify price + warehouse in CJ before publishing.
- **Warehouse: 68 US, 37 China.** CJ-only relaxation of the US-first rule applies; flag China items at review.
- **Electronics are thin: 10 items** (smart watches, Bluetooth beanie headphones, Airtag wallet, etc.). **No earbuds and no name-brand tennis shoes in the 105** — those departments are "Coming soon" cards only, no fake listings. Name-brand shoes only if a legit authorized wholesaler is found; otherwise cool designer-style.
- **Gift sets: coming soon only.** Sets are built from approved items only, never promised as one box.
- **Discount / Blowout Sale (Diana, 2026-11-21):** 55 items flagged `discount: true` — the lowest-priced items, CJ cost low-end under $5. Shown as their own section + a "Discount / Blowout" filter. No % off is claimed (no original retail price to compare); retail sale prices still to be set at price verification.

## What still needs Diana / the next steps (before anything goes live)

1. **Picture review:** pull the real picture for each of the 105 from its CJ product page and let Diana keep/cut. This is the main blocker — only 2 pictures are in hand.
2. **Price verification:** confirm every CJ cost + shipping + warehouse in CJ; set retail prices.
3. **CJ login fix:** the saved CJ login was rejected — 55 of the 105 are still not imported as drafts in EasyWP. Fix the login, then import the rest.
4. **Fill to hundreds:** 105 is the verified start, not hundreds yet. Next pulls (after the CJ login is fixed): CJ US-warehouse electronics (earbuds/headphones), shoes, gift sets, kids/teens — plus the Camellia gift vendors where they fit (Wona/A La Mode for jewelry/accessories). Nothing is added without a real picture and a confirmed dropship price.
5. **Checkout:** NOT wired yet, on purpose. Buy buttons are disabled. Stripe is the intended route for a gift store (same question as Camellia: same WunderBar EuroShop Stripe account or a separate one — Diana to confirm in writing).
6. **Domain:** littleluxuriesemporium.online, EasyWP renews **Dec 8, 2026**. Do not flip DNS or cancel EasyWP until the Vercel preview is approved and checkout is decided.

## Rules that still stand

- Diana must SEE real pictures before anything sells; drafts until she says go live.
- Dropship only — nothing she has to ship out or buy in bulk. No Faire stock (Faire does not dropship).
- Zero money out. Vercel free tier only.
- No Shopify. No fake name-brand claims. No vendor contact / signup / payment without Diana's word.
- No explanatory descriptions under sections.
