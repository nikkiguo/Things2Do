require("secrets");

const express = require("express");
const app = express();
const port = 3000;

var cors = require("cors");
var request = require("request");

app.use(cors());

const apiKey = `Bearer ${process.env.YELP_KEY}`;

const apiLimit = 5;
const searchRadius = 9999; // 40km search radius (test 10km)

const businessSearch = (latitude, longitude, sdk) => {
  sdk
    .v3_business_search({
      latitude,
      longitude,
      sort_by: "best_match",
      limit: apiLimit,
      radius: searchRadius,
      price, // 1 2 3 4
    })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => console.error(err));
};

// calls https://docs.developer.yelp.com/reference/v3_business_search, returns locations within 50km
const yelpGetLocations = (startCoordinates) => {
  // GET yelp endpoint using start coordinates
  const startLongitude = startCoordinates.longitude;
  const startLatitude = startCoordinates.latitude;

  const sdk = require("api")("@yelp-developers/v1.0#2hsur2ylbank95o");
  sdk.auth(apiKey);

  // update each location with category type
  const foodLocations = businessSearch(startLatitude, startLongitude, sdk).map(
    (location) => {
      location.category = "food";
    }
  );
  const entertainmentLocations = businessSearch(
    startLatitude,
    startLongitude,
    sdk
  ).map((location) => {
    location.category = "entertainment";
  });

  const shoppingLocations = businessSearch(
    startLatitude,
    startLongitude,
    sdk
  ).map((location) => {
    location.category = "shopping";
  });

  return {
    food: foodLocations,
    entertainment: entertainmentLocations,
    shopping: shoppingLocations,
  };
};

const orsGetDuration = (location, transportMethod) => {
  var request = require('request');
  request({
    method: 'POST',
    url: `https://api.openrouteservice.org/v2/matrix/${transportMethod}`,
    body: location,
    headers: {
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      'Authorization': '',
      'Content-Type': 'application/json; charset=utf-8'
    }}, function (error, response, body) {
    console.log('Status:', response.statusCode);
    console.log('Headers:', JSON.stringify(response.headers));
    console.log('Response:', body);
  });
};

const activityTime = (constraints) => {};

// locations is list of businesses
const bestLocationsAlgorithm = (locations, constraints, timeLimit) => {
  const timeLimitSeconds = timeLimit * 3600;
  const bestLocations = [];
  let curTime = timeLimitSeconds - activityTime(constraints);
  let prevLocation = null;

  // sort in descending order of distance (reversed for easy pop!)
  const maxFoodLocations = Object.values(locations.food).sort(
    (a, b) => b.distance - a.distance
  );

  const maxEntLocations = Object.values(locations.entertainment).sort(
    (a, b) => b.distance - a.distance
  );

  const maxShoppingLocations = Object.values(locations.shopping).sort(
    (a, b) => b.distance - a.distance
  );

  const categories = {
    food: maxFoodLocations,
    entertainment: maxEntLocations,
    shopping: maxShoppingLocations,
  };

  // for each category, take; stop once done or exceeded
  for (category of Object.keys(categories)) {
    while (constraints.category > 0) {
      const minLoc = categories.category.pop();
      if (!minLoc) {
        // ran out in category, go to next category
        break;
      }
      const curTravel = travelTime(prevLocation, minLoc.coordinates);
      if (curTime + curTravel > timeLimitSeconds * 1.2) {
        // over time limit
        return bestLocations;
      } else {
        // accumulate travel time, update previous location, add to best
        bestLocations += minLoc;
        curTime += curTravel;
        prevLocation = minLoc;
      }
      constraints.category--;
    }
  }

  return bestLocations;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  const businesses = yelpGetLocations({
    latitude: 43.47237,
    longitude: -80.538872,
  });
  console.log(businesses);
  res.send("check console");
});

app.get("/testORS", (req, res) => {
  const durations = orsGetDuration(
    '{"locations":[[9.70093,48.477473],[9.207916,49.153868],[37.573242,55.801281]]}',
    "driving-car"
  );
  console.log(durations);
  res.send("check console");
});

app.post("/algorithm", (req, res) => {
  const { coordinates, constraints, timeLimit } = req.body;
  const yelpLocations = yelpGetLocations(coordinates);
  console.log(yelpLocations);
  debugger;
  // ensure timeLimit in seconds
  const algoResult = bestLocationsAlgorithm(
    yelpLocations.businesses,
    constraints,
    timeLimit
  );
  res.send(algoResult);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
