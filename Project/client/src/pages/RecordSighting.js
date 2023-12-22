import React from "react";
import SightingsForm from "../components/SightingsForm";
import "../styles/RecordSighting.css";

class RecordSighting extends React.Component {

  render = () => {
    return (
      <div>
        <header>
          <p className="recordSightingTitle">Record a Pangolin Sighting</p>
        </header>
        <SightingsForm />
      </div>
    );
  };
}

export default RecordSighting;