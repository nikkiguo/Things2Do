import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import Group from "./pages/Group.js";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="group" element={<Group />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

/*
1. Host Page
## choose location (coordinates?)
map choose -> coordinates -> backend

## time limit

## create group and link

---

## lock in button -> calculate the goods

2. user page (localhost:8080/UUID)
## choose an OSM category

*/

/*
TODO
- finalize plan button, hide until group create

# routing
- send UUID to param
*/
