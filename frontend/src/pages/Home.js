import React, { useState } from "react";
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'

const Home = () => {
  const [response, setResponse] = useState(0);
  const [timelimit, setTimelimit] = useState(0);
  const [location, setLocation] = useState({
    name: "Campus Services Bldg, 1280 Main St W Building Room 102, Hamilton, ON L8S 4L8",
    coordinates: [43.26225, -79.92025],
  });

  const request = () => {
    fetch("http://127.0.0.1:8080/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setResponse(data);
      });
  };

  const finalizeGroup = () => {};

  return (
    <div className="Home">
      <div class="header">
        <h1 class="text-2xl text-center font-medium">Things2Do</h1>
      </div>
      <div class="pt-8">
        <label for="hangout-name" class="block text-sm font-sm text-gray-700">Name your hangout:</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <input type="text" name="hangout-name" id="hangout-name" class="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="My Hamilton Extravaganza"/>
        </div>
      </div>
      <div class="pt-8">
        <label for="autocomplete-address-container" class="block text-sm font-sm text-gray-700">Choose a start location:</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <GeoapifyContext apiKey="65e6c894e9d046ceb2959fd30c2a1ddc">
            <GeoapifyGeocoderAutocomplete
              style="round-borders" 
              placeholder="1280 Main St W Building Room 102, Hamilton, ON L8S 4L8"
              // placeSelect={onPlaceSelect}
              class="blockautocomplete-address-container w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </GeoapifyContext>
        </div>
      </div>
      <div class="pt-8">
        <label for="time-limit" class="block text-sm font-sm text-gray-700">Set a time limit (hours):</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <input type="number" min="0" name="time-limit" id="time-limit" class="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="0 hours"/> 
        </div>
      </div>
      <div class="pt-8">
        <label for="travel-limit" class="block text-sm font-sm text-gray-700">How far are you willing to travel (km)?</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <input type="number" min="0" name="travel-limit" id="travel-limit" class="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="0 km"/>
        </div>
      </div>
      <div class="pt-8">
        <button class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-sm text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
          onClick={finalizeGroup}>
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Create Event
          </span>
        </button>
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img class="rounded-t-lg" src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
            </a>
            <div class="p-5">
                <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Pasta Place</h5>
                </a>
                <p class="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">🌟 4/5 stars based on 100 reviews</p>
                <p class="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">⏱️ 1.5 km from your location</p>
                <p class="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">📌 1280 Main St W Building Room 102, Hamilton, ON</p>
                <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Yelp reviews
                    <svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </a>
            </div>
        </div>
      </div>
      <div class="pt-8 hidden">
        <h1>Location: {location.name}</h1>
        <h2>Coordinates: {location.coordinates.join(", ")}</h2>
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
        <p onClick={request}>click</p>
        <p>{JSON.stringify(response)}</p>
        </div>
    </div>
  );
};

export default Home;


