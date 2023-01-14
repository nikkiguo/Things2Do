import React, { useState } from "react";

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
  );
};

export default Home;
