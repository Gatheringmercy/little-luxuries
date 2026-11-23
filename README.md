# Little Luxuries Emporium — Vercel site (LIVE on Vercel preview, 2026-11-22)

Built 2026-11-21, launched on the Vercel preview 2026-11-22. **Do NOT change DNS and do NOT cancel EasyWP until Diana approves the preview and says go.** Domain littleluxuriesemporium.online is bought; pointing is paused.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The storefront. Traditional Christmas colors (red, green, gold, white), title "Little Luxuries Emporium", Diana's hero video + silent falling-diamonds/snowflakes background video, department filters + search, Buy buttons wired to Stripe single checkout (`/api/create-checkout-session`). Loads `products.json`. No explanatory descriptions under sections, per Diana 2026-11-21. **Cart (2026-11-23):** Add to Cart on every card, cart drawer with quantities + subtotal, cart saved in the browser; Checkout sends the whole cart to the function in one Stripe session. Buy Now (single item) still works. |
| `gifts.json` | Free-gift data: `threshold_cents` ($75) and the `gifts` list (empty until Diana picks the gift items). The cart shows a gift picker only when the subtotal reaches the threshold and the list is not empty. Gift names only — no prices on the free gifts. |
| `products.json` | **608 products** (2026-11-22 launch): 105 real CJ Dropshipping products from the two verified files (`affordable-christmas-gifts-cj-42-2026-11-09.csv` + `affordable-christmas-gifts-cj-63-2026-11-10.csv`) + 437 moved from The Crystal Camellia 2026-11-22 (Camellia goes fine-only) + 66 CJ Christmas items added 2026-11-22 (57 Christmas decor/gifts, 5 baby Christmas, 3 family pajamas, 1 faith gift box). No invented products, no invented prices, no fake name-brand claims. CJ prices set at listed cost x 1.5 retail; CJ costs still to verify against live CJ. |
| `api/create-checkout-session.js` | Stripe Checkout session function (copied from Camellia's working wiring). Needs `STRIPE_SECRET_KEY` in the Vercel project settings. |
| `package.json` | Serverless dependency: `stripe` ^17.0.0. |
| `hero.mp4` | Diana's video (12 MB), uploaded 2026-11-21 15:38 PST — Christmas store interior, "LITTLE LUXURIES EMPORIUM — Christmas gifts for everybody". |
| `bg.mp4` | Diana's second video (uploaded 2026-11-21), re-encoded silent, 1280x720 — falling diamonds and snowflakes in red/green/gold, as the background behind the whole page, like Camellia. |
| `hero-poster.jpg` | Poster frame from the hero video. |
| `vercel.json` | Site config (clean URLs). |
| `counts.json` | Product counts by department (608 total, 2026-11-22). |

## Product counts (2026-11-22 launch — 608 total)

- Christmas Gifts 101, Jewelry 216, Accessories 150, Home & Comfort 52, Clothing 25, Home Gifts 12, Bath, Body & Massage 12, Electronics & Gadgets 10, For Men 8, Pajamas & Loungewear 8, Kids & Toys 7, Shoes & Slippers 7 = **608 total**.
- **Gift sets are IN:** 7 Christmas gift boxes/sets from CJ (lighted gift boxes, gift set for women) plus 5 baby Christmas gift sets and 3 family pajama sets — the launch blocker from 2026-11-22 is done.
- **Only 2 of the original 105 CJ items have a picture URL in the files, and none of the 66 new CJ Christmas items do.** The other items show "Picture on the supplier page — review before live". Diana must SEE the real picture for each one before it goes live — that is the big remaining step (439 of 608 have pictures).
- **Prices are set at CJ cost x 1.5 retail** (2026-11-22). The 63-file prices are ranges (e.g. "$0.97-12.90") — priced from the low end. Retail markup is set, but the underlying CJ costs are still unverified against live CJ. Verify price + warehouse in CJ before relying on them.
- **Warehouse: 68 US, 37 China (original 105); the 66 new CJ Christmas items have warehouse "to verify".** CJ-only relaxation of the US-first rule applies; flag China items at review.
- **Electronics are thin: 10 items** (smart watches, Bluetooth beanie headphones, Airtag wallet, etc.). **No earbuds and no name-brand tennis shoes in the store** — those departments are "Coming soon" cards only, no fake listings. Name-brand shoes only if a legit authorized wholesaler is found; otherwise cool designer-style.
- **Discount / Blowout Sale (Diana, 2026-11-21):** 236 items flagged `discount: true` — the lowest-priced items. Shown as their own section + a "Discount / Blowout" filter. No % off is claimed (no original retail price to compare).

## What still needs Diana / the next steps (before anything goes live)

1. **Picture review:** pull the real picture for each CJ item without one (103 of the original 105 + all 66 new Christmas items) from its CJ product page and let Diana keep/cut. This is the main blocker.
2. **Price verification:** confirm every CJ cost + shipping + warehouse in CJ; retail is set at cost x 1.5 but the costs themselves are unverified.
3. **CJ login fix:** the saved CJ login was rejected — 55 of the 105 are still not imported as drafts in EasyWP. Fix the login, then import the rest.
4. **Fill to hundreds:** 608 is the launch count. Next pulls (after the CJ login is fixed): CJ US-warehouse electronics (earbuds/headphones), shoes, kids/teens — plus the Camellia gift vendors where they fit (Wona/A La Mode for jewelry/accessories). Nothing is added without a real picture and a confirmed dropship price.
5. **Checkout:** wired 2026-11-22 (Stripe single checkout, same pattern as Camellia). It needs `STRIPE_SECRET_KEY` added in the Vercel project settings — same WunderBar EuroShop restricted key as Camellia unless Diana wants a separate Stripe account for this store. The Vercel project must also be linked to the Gatheringmercy/little-luxuries repo so pushes auto-deploy, and the videos (bg.mp4, hero.mp4, hero-poster.jpg) are NOT in GitHub — they must be deployed to Vercel separately or the page loads without them.
6. **Domain:** littleluxuriesemporium.online, EasyWP renews **Dec 8, 2026**. Do not flip DNS or cancel EasyWP until the Vercel preview is approved and checkout is decided.

## Rules that still stand

- Diana must SEE real pictures before anything sells; drafts until she says go live.
- Dropship only — nothing she has to ship out or buy in bulk. No Faire stock (Faire does not dropship).
- Zero money out. Vercel free tier only.
- No Shopify. No fake name-brand claims. No vendor contact / signup / payment without Diana's word.
- No explanatory descriptions under sections.
