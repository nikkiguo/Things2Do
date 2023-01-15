import React, { useState } from "react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const Home = () => {
  const [startLocation, setStartLocation] = useState(
    "1280 Main St W Building Room 102, Hamilton, ON L8S 4L8"
  );

  const [planName, setPlanName] = useState("New Plan");

  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const [constraints, setConstraints] = useState({
    categories: {
      food: 1,
      entertainment: 1,
      shopping: 1,
    },
    timeAlloc: {
      food: 60,
      entertainment: 60,
      shopping: 60,
    },
    timeLimit: 3,
    travelLimit: 10,
    startLocation,
  });

  const finalizeGroup = () => {
    // send coordinates, constraints, time limit to backend
    fetch("http://127.0.0.1:8000/algorithm", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ constraints, name: planName }),
    })
      .then((response) => {
        // format to return in next then
        return response.json();
      })
      .then((data) => {
        setLocationSuggestions(data);
      });
  };

  return (
    <div className="Home">
      <div className="header">
        <h1 className="text-2xl text-center font-medium">Things2Do</h1>
      </div>
      <div className="pt-8">
        <label
          htmlFor="hangout-name"
          className="block text-sm font-sm text-gray-700"
        >
          Name your hangout:
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="text"
            name="hangout-name"
            id="hangout-name"
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="My Hamilton Extravaganza"
            onChange={(e) => {
              setPlanName(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="pt-8">
        <label
          htmlFor="autocomplete-address-container"
          className="block text-sm font-sm text-gray-700"
        >
          Choose a start location:
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <GeoapifyContext apiKey="">
            <GeoapifyGeocoderAutocomplete
              style="round-borders"
              placeholder="1280 Main St W Building Room 102, Hamilton, ON L8S 4L8"
              // placeSelect={onPlaceSelect}
              value={startLocation}
              className="blockautocomplete-address-container w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </GeoapifyContext>
        </div>
      </div>
      <div className="pt-8">
        <label
          htmlFor="time-limit"
          className="block text-sm font-sm text-gray-700"
        >
          Set a time limit (hours):
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="number"
            min="0"
            name="time-limit"
            id="time-limit"
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="3 hours"
          />
        </div>
      </div>
      <div className="pt-8">
        <label
          htmlFor="travel-limit"
          className="block text-sm font-sm text-gray-700"
        >
          How far are you willing to travel (km)?
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="number"
            min="0"
            name="travel-limit"
            id="travel-limit"
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="10 km"
          />
        </div>
      </div>
      <div className="categories pt-8">
        <h1>Hangout Categories</h1>
        <div className="food-wrapper pt-4">
          <label htmlFor="food" className="pr-4 text-sm font-sm text-gray-700">
            Food visits:
          </label>
          <input
            type="number"
            name="food"
            placeholder="1 visit"
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            onChange={(e) => {
              constraints.categories.food = e.target.value;
            }}
          ></input>
          <label
            htmlFor="food-alloc"
            className="pl-8 pr-4 text-sm font-sm text-gray-700"
          >
            Time allocated (minutes):
          </label>
          <input
            type="number"
            name="food-alloc"
            placeholder="60 minutes"
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            onChange={(e) => {
              constraints.timeAlloc.food = e.target.value;
            }}
          ></input>
        </div>
        <div className="entertainment-wrapper pt-4">
          <label
            htmlFor="entertainment"
            className="pr-4 text-sm font-sm text-gray-700"
          >
            Entertainment visits:
          </label>
          <input
            type="number"
            name="entertainment"
            placeholder="1 visit"
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            onChange={(e) => {
              constraints.categories.entertainment = e.target.value;
            }}
          ></input>
          <label
            htmlFor="entertainment-alloc"
            className="pl-8 pr-4 text-sm font-sm text-gray-700"
          >
            Time allocated (minutes):
          </label>
          <input
            type="number"
            name="entertainment-alloc"
            placeholder="60 minutes"
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            onChange={(e) => {
              constraints.timeAlloc.entertainment = e.target.value;
            }}
          ></input>
        </div>
        <div className="shopping-wrapper pt-4">
          <label
            htmlFor="shopping"
            className="pr-4 text-sm font-sm text-gray-700"
          >
            Shopping visits:
          </label>
          <input
            type="number"
            name="shopping"
            placeholder="1 visit"
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            onChange={(e) => {
              constraints.categories.shopping = e.target.value;
            }}
          ></input>
          <label
            htmlFor="shopping-alloc"
            className="pl-8 pr-4 text-sm font-sm text-gray-700"
          >
            Time allocated (minutes):
          </label>
          <input
            type="number"
            name="shopping-alloc"
            placeholder="60 minutes"
            className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            onChange={(e) => {
              constraints.timeAlloc.shopping = e.target.value;
            }}
          ></input>
        </div>
      </div>
      <div className="pt-8">
        <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-sm text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
          onClick={finalizeGroup}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Create Event
          </span>
        </button>
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img
              className="rounded-t-lg"
              src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt=""
            />
          </a>
          <div className="p-5">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Pasta Place
              </h5>
            </a>
            <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">
              🌟 4/5 stars based on 100 reviews
            </p>
            <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">
              ⏱️ 1.5 km from your location
            </p>
            <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">
              📌 1280 Main St W Building Room 102, Hamilton, ON
            </p>
            <a
              href="#"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Yelp reviews
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* hidden boilerplate html */}
      <div className="pt-8 hidden">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Time Limit (hours)
          </label>
          <br></br>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="1"
          />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Group
        </button>
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={finalizeGroup}
        >
          Finalize Group
        </button>
      </div>
    </div>
  );
};

export default Home;
