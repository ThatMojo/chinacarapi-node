"use strict";

const DEFAULT_BASE_URL = "https://api.chinacarapi.com";
const SIGNUP_URL = "https://chinacarapi.com";

class ChinaCarAPIError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ChinaCarAPIError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Official Node.js client for ChinaCarAPI: Chinese used-car data (Dongchedi and
 * Che168) as one REST API, in English.
 *
 * A ChinaCarAPI key is REQUIRED (EnCarAPI keys with the China add-on work too).
 * Get one (5-day trial) at https://chinacarapi.com.
 *
 *   const { ChinaCarAPI } = require("chinacarapi");
 *   const client = new ChinaCarAPI(process.env.CHINACARAPI_KEY);
 *   const cars = await client.catalog({ make: "BYD", export_ready: true, limit: 25 });
 *   const car = await client.vehicle(cars.results[0].id);
 */
class ChinaCarAPI {
  constructor(apiKey, options = {}) {
    apiKey = apiKey || process.env.CHINACARAPI_KEY;
    if (!apiKey) {
      throw new ChinaCarAPIError(
        "A ChinaCarAPI key is required. Pass new ChinaCarAPI('YOUR_KEY') or set the " +
          `CHINACARAPI_KEY environment variable. Get a key at ${SIGNUP_URL}`
      );
    }
    if (typeof fetch !== "function") {
      throw new ChinaCarAPIError("Global fetch is not available: Node.js 18+ is required (or provide a fetch polyfill).");
    }
    this.apiKey = apiKey;
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
  }

  async _request(method, path, { params, body, text } = {}) {
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(params || {})) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
    const res = await fetch(url, {
      method,
      headers: { "x-api-key": this.apiKey, Accept: text ? "text/csv" : "application/json", ...(body ? { "Content-Type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const raw = await res.text();
    if (res.status === 401 || res.status === 403) {
      throw new ChinaCarAPIError(
        `ChinaCarAPI rejected the request (${res.status}). Check your key or plan at ${SIGNUP_URL}. Body: ${raw.slice(0, 300)}`,
        res.status, raw
      );
    }
    if (!res.ok) throw new ChinaCarAPIError(`ChinaCarAPI error ${res.status}: ${raw.slice(0, 300)}`, res.status, raw);
    if (text) return raw;
    try { return JSON.parse(raw); } catch { return raw; }
  }

  /** Search the catalog. Filters: source, duplicates, make, model, year_min/max, reg_year_min/max,
   *  price_min/max (CNY), mileage_max, city, fuel, has_report, export_ready, updated_since,
   *  sort (newest|price_asc|price_desc|mileage_asc|year_desc), page, limit, lang ("zh" = original Chinese). */
  catalog(params) { return this._request("GET", "/api/catalog", { params }); }

  /** Full record for one car (price history, photos, seller, export status, alsoListedOn). */
  vehicle(id, params) { return this._request("GET", `/api/vehicle/${encodeURIComponent(id)}`, { params }); }

  /** Inspection report: accident, flood and fire checks, battery data for EVs. */
  inspection(id, params) { return this._request("GET", `/api/inspection/${encodeURIComponent(id)}`, { params }); }

  /** Up to 500 full records in one call (Business and Scale plans, trial). */
  bulk(ids, params) { return this._request("POST", "/api/vehicle/bulk", { params, body: { ids } }); }

  /** Change feed for syncing: pass { since } once, then { cursor: nextCursor } (Business and Scale, trial: 7 days). */
  changes(params) { return this._request("GET", "/api/catalog/changes", { params }); }

  /** Full catalog as CSV text (Business and Scale plans). */
  exportCsv() { return this._request("GET", "/api/catalog/export", { text: true }); }

  /** Filter values with counts: makes, fuels, cities, sources, sorts (cache for 24 h). */
  enums(params) { return this._request("GET", "/api/enums", { params }); }

  /** Models of one make (id or English name) with counts. */
  models(make) { return this._request("GET", "/api/models", { params: { make } }); }
}

module.exports = { ChinaCarAPI, ChinaCarAPIError };
