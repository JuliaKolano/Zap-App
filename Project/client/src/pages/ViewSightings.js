import React from "react";
import "../styles/ViewSightings.css";
import SearchBar from "../components/SearchBar";
import SightingList from "../components/SightingList";

class ViewSighting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          query: "",
          loading: false,
          searched: false,
          sightings: [],
        };
      }
    
      updateState = (query, loading, searched, sightings) => {
        this.setState({
          query: query,
          loading: loading,
          searched: searched,
          sightings: sightings,
        });
      };
    
      render = () => {
        return (
            <div>
              <header>
                <p className="ViewSightingsTitle">View Pangolin Sightings</p>
              </header>
              <SearchBar updateState={this.updateState} />
              <SightingList state={this.state} />
            </div>
        );
      };
}

export default ViewSighting;