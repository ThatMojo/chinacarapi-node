// CHINACARAPI_KEY=your_key node examples/quickstart.js
const { ChinaCarAPI } = require("../src/index.js");

(async () => {
  const client = new ChinaCarAPI(process.env.CHINACARAPI_KEY); // key from https://chinacarapi.com
  const { total, results } = await client.catalog({ make: "BYD", export_ready: true, sort: "price_asc", limit: 5 });
  console.log(`${total} export-ready BYD cars, cheapest:`);
  for (const car of results) console.log(`${car.title} | ${car.mileageKm} km | ${car.price.eur} EUR | ${car.source}`);
  const report = await client.inspection(results[0].id).catch(() => null);
  if (report) console.log("Inspection:", report.summary[0].result);
})();
