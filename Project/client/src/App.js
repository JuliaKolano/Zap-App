import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import ViewSightings from "./pages/ViewSightings";
import RecordSighting from "./pages/RecordSighting";

class App extends React.Component {

  render = () => {
    return (
      <Router>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/ViewSightings" element={<ViewSightings />} />
            <Route path="/RecordSighting" element={<RecordSighting />} />
          </Routes>
          <Menu />
      </Router>
    );
  };
}

export default App;