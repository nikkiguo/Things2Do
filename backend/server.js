require("secrets");

const express = require("express");
const app = express();
const port = 3000;

var cors = require("cors");

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
      categories,
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

  const foodLocations = businessSearch(startLatitude, startLongitude, sdk);
  const entertainmentLocations = businessSearch(
    startLatitude,
    startLongitude,
    sdk
  );
  const shoppingLocations = businessSearch(startLatitude, startLongitude, sdk);

  return {
    food: foodLocations,
    entertainment: entertainmentLocations,
    shopping: shoppingLocations,
  };
};

const activityTime = (constraints) => {};

// locations is list of businesses
const bestLocationsAlgorithm = (locations, constraints, timeLimit) => {
  const timeLimitSeconds = timeLimit * 3600;
  const bestLocations = [];
  let curTime = timeLimitSeconds - activityTime(constraints);
  let prevLocation = null;
  const minDistLocations = Object.keys(locations).sort(
    (a, b) => a.distance - b.distance
  );
  // take smallest distance each time until timeLimitSeconds exceeded
  for (minLoc of minDistLocations) {
    const curTravel = travelTime(prevLocation, minLoc.coordinates);
    if (curTime + curTravel > timeLimitSeconds * 1.2) {
      // over time limit
      break;
    } else {
      // accumulate travel time, update previous location, add to best
      bestLocations += minLoc;
      curTime += curTravel;
      prevLocation = minLoc;
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

app.post("/algorithm", (req, res) => {
  const { coordinates, constraints, timeLimit } = req.body;
  const yelpLocations = yelpGetLocations(coordinates);
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
