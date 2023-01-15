const express = require("express");
const app = express();
const port = 3000;

var cors = require("cors");

app.use(cors());

const apiKey = "Bearer {API_KEY}";

const apiLimit = 5;
const searchRadius = 9999; // 40km search radius (test 10km)

// calls https://docs.developer.yelp.com/reference/v3_business_search, returns locations within 50km
const yelpGetBusiness = (startCoordinates, categories, price) => {
  // GET yelp endpoint using start coordinates
  const startLongitude = startCoordinates.longitude;
  const startLatitude = startCoordinates.latitude;

  const sdk = require("api")("@yelp-developers/v1.0#2hsur2ylbank95o");
  sdk.auth(apiKey);

  sdk
    .v3_business_search({
      latitude: startLatitude,
      longitude: startLongitude,
      sort_by: "best_match",
      limit: apiLimit,
      radius: searchRadius,
      categories,
      price, // 1 2 3 4
    })
    .then(({ data }) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.error(err));
};

const bestLocationsAlgorithm = (locations) => {
  // sort by category, keep category metrics (# found in radius)
  const sdk = require("api")("@yelp-developers/v1.0#4in14vlckiw7rd");
  sdk.auth(apiKey);
  sdk
    .v3_business_reviews({
      limit: apiLimit,
      sort_by: "yelp_sort",
      latitude: "",
      longitude: "",
      business_id_or_alias: "H4jJ7XB3CetIr1pg56CczQ",
    })
    .then(({ data }) => console.log(data))
    .catch((err) => console.error(err));
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  const businesses = yelpGetBusiness({
    latitude: 43.47237,
    longitude: -80.538872,
  });
  res.send(businesses);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
