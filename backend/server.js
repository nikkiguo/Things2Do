require("secrets");

const express = require("express");
const app = express();
const port = 8000;

var cors = require("cors");
var request = require("request");
var bp = require("body-parser");

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const apiKey = `Bearer ${process.env.YELP_KEY}`;

const apiLimit = 2;
const searchRadius = 9999; // 40km search radius (test 10km)

const businessSearch = async (latitude, longitude, term) => {
  const sdk = require("api")("@yelp-developers/v1.0#2hsur2ylbank95o");
  sdk.auth(apiKey);
  const res = await sdk.v3_business_search({
    latitude,
    longitude,
    sort_by: "best_match",
    limit: apiLimit,
    radius: searchRadius,
    term,
  });
  try {
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

// calls https://docs.developer.yelp.com/reference/v3_business_search, returns locations within 40km
const yelpGetLocations = async (startCoordinates) => {
  console.log("start coords", startCoordinates);
  // GET yelp endpoint using start coordinates
  const startLongitude = startCoordinates.longitude;
  const startLatitude = startCoordinates.latitude;

  // update each location with category type
  const foodLocations = await businessSearch(
    startLatitude,
    startLongitude,
    "food"
  );
  const entertainmentLocations = await businessSearch(
    startLatitude,
    startLongitude,
    "entertainment"
  );

  const shoppingLocations = await businessSearch(
    startLatitude,
    startLongitude,
    "shopping"
  );

  return {
    food: foodLocations,
    entertainment: entertainmentLocations,
    shopping: shoppingLocations,
  };
};

const orsGetDuration = async (location, transportMethod) => {
  const { start, end } = location;
  if (start === null) {
    // first in path
    return {
      durations: [
        [0, 0],
        [0, 0],
      ],
    };
  }
  const startEnd = `[[${start.latitude}, ${start.longitude}], [${end.latitude}, ${end.longitude}]]`;

  return new Promise((resolve, reject) => {
    return request(
      {
        method: "POST",
        url: `https://api.openrouteservice.org/v2/matrix/${transportMethod}`,
        body: startEnd,
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization: process.env.ORS_KEY,
          "Content-Type": "application/json; charset=utf-8",
        },
      },
      function (error, response, body) {
        try {
          // JSON.parse() can throw an exception if not valid JSON
          resolve(body);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

// locations is list of businesses
const bestLocationsAlgorithm = async (locations, constraints, timeLimit) => {
  const timeLimitSeconds = timeLimit * 3600;
  const bestLocations = [];
  // timeAlloc is in MINUTES, MINUTES * 60 -> SECONDS
  const usedTime =
    Object.values(constraints.timeAlloc).reduce((a, b) => {
      return a + b;
    }, 0) * 60;
  let curTime = timeLimitSeconds - usedTime;
  let prevLocation = null;
  let curTravel = null;

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
  // console.log("categories", categories);

  // for each category, take; stop once done or exceeded
  for (category of Object.keys(categories)) {
    while (constraints.categories[category] > 0) {
      if (categories[category].length === 0) {
        // ran out of physical locations in the category while there is still demand left, go to next
        break;
      }
      const minLoc = categories[category].pop();
      console.log("category count", constraints.categories);
      curTravel = await orsGetDuration(
        {
          start:
            prevLocation != null
              ? {
                  latitude: prevLocation.coordinates.latitude,
                  longitude: prevLocation.coordinates.longitude,
                }
              : null,
          end: {
            latitude: minLoc.coordinates.latitude,
            longitude: minLoc.coordinates.longitude,
          },
        },
        constraints.transportMethod
      );
      console.log("curTravel", await curTravel);
      const curTravelTime = Math.min(
        curTravel.durations[0][1],
        curTravel.durations[1][0]
      );
      if (curTime + curTravelTime > timeLimitSeconds * 1.2) {
        // over time limit
        return bestLocations;
      } else {
        // accumulate travel time, update previous location, add to best
        bestLocations.push(minLoc);
        console.log("curTravelTime", curTravelTime);
        curTime += curTravelTime;
        prevLocation = minLoc;
        console.log("curtime", curTime);
      }
      constraints.categories[category]--;
    }
  }

  return bestLocations;
};

const getCoords = (address) => {
  return new Promise((resolve, reject) => {
    request(
      {
        method: "GET",
        url: `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${process.env.GEOAPIFY_KEY}`,
      },
      function (error, response, body) {
        try {
          // JSON.parse() can throw an exception if not valid JSON
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      }
    );
  });
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

app.post("/algorithm", async (req, res) => {
  const { constraints, planName } = req.body;
  const {
    categories,
    timeAlloc,
    timeLimit,
    travelLimit,
    startLocation,
    transportMethod,
  } = constraints;

  const startCoords = await getCoords(startLocation);

  const yelpLocations = await yelpGetLocations({
    latitude: startCoords.features[0].properties.lat,
    longitude: startCoords.features[0].properties.lon,
  });
  console.log("running algorithm...");
  // ensure timeLimit in seconds
  const algoResult = bestLocationsAlgorithm(
    {
      food: yelpLocations.food.businesses,
      entertainment: yelpLocations.entertainment.businesses,
      shopping: yelpLocations.shopping.businesses,
    },
    constraints,
    timeLimit
  );
  res.send(algoResult);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
