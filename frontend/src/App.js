import React, { useState } from "react";

import "./App.css";

function App() {
  const [response, setResponse] = useState(0);

  const request = () => {
    fetch("http://127.0.0.1:8080/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setResponse(data);
      });
  };

  return (
    <div className="App">
      <p onClick={request}>click</p>
      <p>{JSON.stringify(response)}</p>
    </div>
  );
}

export default App;
