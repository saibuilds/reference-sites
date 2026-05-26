# Live listings via RESO Web API

Real listings populate the reference sites at **build time**, so the API
token never reaches the browser — it stays a Cloudflare environment
variable, exactly the protected pattern you used before.

## How it works

```
Cloudflare build:
  node tools/fetch-listings.js   # reads RESO_* env vars, fetches listings,
                                 # writes data/listings.json (token-side only)
  node build.js                  # loadListings() bakes them into the pages
  node build-index.js
```

- `data/listings.json` is **gitignored** and generated fresh on every
  Cloudflare build. If it's absent or empty, pages show a clean
  placeholder instead — the build never breaks.
- The listings render in the **`listingsGrid`** section, currently wired
  into `08-architecture-editorial` (both the generic and real-estate
  variants). Add `'listingsGrid'` to any other archetype's `layout` in
  `build.js` to surface listings there too.

## Set these in Cloudflare → your environment → Variables

Required:

| Var | Meaning |
|-----|---------|
| `RESO_BASE` | OData service root, e.g. `https://api.bridgedataoutput.com/api/v2/OData/<dataset>` (no trailing `/Property`) |

Auth — **either** a static bearer token:

| Var | Meaning |
|-----|---------|
| `RESO_TOKEN` | Bearer token for the feed (simplest) |

**or** OAuth2 client-credentials (RESO standard):

| Var | Meaning |
|-----|---------|
| `RESO_TOKEN_URL` | OAuth2 token endpoint |
| `RESO_CLIENT_ID` | client id |
| `RESO_CLIENT_SECRET` | client secret |
| `RESO_SCOPE` | optional scope |

Optional tuning:

| Var | Default | Meaning |
|-----|---------|---------|
| `RESO_TOP` | `12` | how many listings to pull |
| `RESO_FILTER` | `StandardStatus eq 'Active'` | OData `$filter` |

## Set the Cloudflare build command

In the `reference-sites` Workers Builds settings, set the build command to:

```
node tools/fetch-listings.js && node build.js && node build-index.js
```

(Currently it's just `node build.js && node build-index.js` — add the
fetch step in front.)

## Fields used

Standard RESO Data Dictionary fields, normalized to a simple card:
`ListPrice, UnparsedAddress, City, StateOrProvince, BedroomsTotal,
BathroomsTotalInteger, LivingArea, PropertyType, StandardStatus,
ListingURL, Media`. If your provider names anything differently, adjust
`normalize()` in `tools/fetch-listings.js`.

## Local testing

You can't reach the RESO host from the `refsites-code` cloud session
(network allowlist), so listings only populate in the Cloudflare build
or on a machine/session with outbound access:

```
set -a && source .mcp.env && set +a   # if you keep RESO_* in .mcp.env locally
node tools/fetch-listings.js && node build.js && node build-index.js
```

## Compliance note

MLS/board feeds carry IDX/VOW display rules (attribution, disclaimers,
opt-outs, update frequency). Confirm your data agreement's requirements
before going public — the renderer is easy to extend with the required
attribution/disclaimer text.
