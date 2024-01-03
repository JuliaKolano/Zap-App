import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "../images/home.png";
import viewSightings from "../images/viewSightings.png";
import recordSighting from "../images/recordSighting.png";

// main app navigation at the bottom of the screen
class Menu extends React.Component {
  render = () => {
    return (
      <div className="menu">
        <Link className="menuItem" to="/">
          <img src={HomeIcon} alt="home icon" width="40" height="40"></img>
        </Link>
        <Link className="menuItem" to="/ViewSightings">
          <img
            src={viewSightings}
            alt="view sightings icon"
            width="40"
            height="40"
          ></img>
        </Link>
        <Link className="menuItem" to="/RecordSighting">
          <img
            src={recordSighting}
            alt="record sighting icon"
            width="37"
            height="37"
          ></img>
        </Link>
      </div>
    );
  };
}

export default Menu;
// home icon obtained from https://icons8.com/icons/set/home
// viewSightings icon obtained from https://icons8.com/icons/set/list
// recordSighting icon obtained from https://icons8.com/icons/set/upload
