# ChinaCarAPI: Node.js client for Chinese car data (Dongchedi API, Che168 API)

Official **Node.js / TypeScript client** for [ChinaCarAPI](https://chinacarapi.com), a REST
**China car API** for the Chinese used-car market. One API for **Dongchedi (懂车帝)** and
**Che168 (车168, Autohome)**: 400,000+ listings with price, mileage, first registration, seller,
photos, inspection reports (accident, flood, fire, EV battery), price history and export status.
Delivered in English, with the original Chinese kept alongside.

Built for car exporters, importers, dealers and marketplaces that need reliable **Chinese car data**
without scrapers, captchas, proxies or Chinese-language parsing.

> **A ChinaCarAPI key is required.** The API and its data are a paid service. This client only
> works with a key from [chinacarapi.com](https://chinacarapi.com) (5-day trial available).
> EnCarAPI keys with the China add-on work as well.

## Install

```bash
npm install github:ThatMojo/chinacarapi-node
```

Requires Node.js 18+. TypeScript types included.

This package is the China entry point of [`encarapi`](https://www.npmjs.com/package/encarapi),
the official client for Korean **and** Chinese used car data. Need both markets? Use
`new EnCarAPI(key)` with `client.korea` and `client.china` (exported here as well).

## Quick start

```js
const { ChinaCarAPI } = require("chinacarapi");

// Get your key at https://chinacarapi.com
const client = new ChinaCarAPI("YOUR_API_KEY"); // or set CHINACARAPI_KEY

(async () => {
  // Export-ready BYDs, cheapest first, from both marketplaces (duplicates merged)
  const { total, results } = await client.catalog({ make: "BYD", export_ready: true, sort: "price_asc", limit: 25 });

  // Full record: price history, photos, seller, alsoListedOn (same car on the other marketplace)
  const car = await client.vehicle(results[0].id);

  // Inspection report: accident, flood and fire checklist, battery data for EVs
  const report = await client.inspection(results[0].id);
})();
```

Without a valid key every call throws a `ChinaCarAPIError` pointing to
[chinacarapi.com](https://chinacarapi.com). There is no free data in this package, only a clean
client for the paid API.

## API

| Method | Endpoint | Description |
|---|---|---|
| `client.catalog(params?)` | `GET /api/catalog` | Search and filter listings (Dongchedi + Che168) |
| `client.vehicle(id, params?)` | `GET /api/vehicle/:id` | Full record of one car |
| `client.inspection(id, params?)` | `GET /api/inspection/:id` | Inspection report |
| `client.bulk(ids, params?)` | `POST /api/vehicle/bulk` | Up to 500 records per call |
| `client.changes({ since \| cursor })` | `GET /api/catalog/changes` | Change feed: new cars, price changes, removals |
| `client.exportCsv()` | `GET /api/catalog/export` | Full catalog as CSV |
| `client.enums()` | `GET /api/enums` | Makes, fuels, cities, sources with counts |
| `client.models(make)` | `GET /api/models` | Models of one make |

**Catalog filters:** `source` (`dongchedi`, `che168`), `duplicates=include`, `make`, `model`,
`year_min`/`year_max`, `reg_year_min`/`reg_year_max`, `price_min`/`price_max` (CNY),
`mileage_max`, `city`, `fuel`, `has_report`, `export_ready` (China's 180-day rule for used-car
exports), `updated_since`, `sort`, `page`, `limit`, `lang=zh` for the original Chinese values.

Full reference (OpenAPI 3.1, 13 languages): [chinacarapi.com/documentation](https://chinacarapi.com/documentation)

## Keeping a local copy

```js
const first = await client.changes({ since: "2026-10-01T00:00:00Z" });
// store first.nextCursor, then poll every few minutes:
const next = await client.changes({ cursor: first.nextCursor });
```

## Why ChinaCarAPI?

- **Dongchedi API and Che168 API in one**: the same car listed on both is merged and linked.
- **English output**: official English make and model names, translated trims and inspection findings.
- **Export status**: ready-made filter for China's 180-day rule on used-car exports.
- **Plans from €99/month**, 5-day trial for €9.99. EnCarAPI (Korea) customers add China from €39/month.

Korean car data: see [EnCarAPI](https://encarapi.com) and its [Node.js client](https://github.com/ThatMojo/encarapi-node).

## License

MIT for this client. The data is only available through a ChinaCarAPI subscription.
