import React from "react";
import defaultImage from "../images/pangolin_1.jpg";
import loadingImage from "../images/loading.svg";

class SightingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedNotes: false,
      locations: {},
    };
  }

  // check of the notes are long enough to be expanded
  handleNotesStatus = () => {
    this.setState((previousState) => ({
      expandedNotes: !previousState.expandedNotes,
    }));
  };

  // split the location coordinates into latitude and longitude
  splitLocationString = (locationString) => {
    const [latitude, longitude] = locationString.split(",").map(parseFloat);
    return { latitude, longitude };
  };

  // check if the location is in a form of coordinates
  isCoordinates = (locationString) => {
    const coordinatesPattern = /^\s*-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?\s*$/;
    return coordinatesPattern.test(locationString);
  };

  // use the OSM Nominatim API to get the name of the location from coordinates
  fetchLocationName = async (latitude, longitude) => {
    try {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        // update the location based on the API response
        if (data.display_name) {
          const locations = {
            ...this.state.locations,
            [`${latitude},${longitude}`]: data.display_name,
          };
          this.setState({ locations });
        }
        // if not able to get the API location name, set it to unknown
      } else {
        console.error("Failed to fetch location name");
        const locations = {
          ...this.state.locations,
          [`${latitude},${longitude}`]: "Unknown",
        };
        this.setState({ locations });
      }
      // if not able to get the API location name, set it to unknown
    } catch (error) {
      console.error("Error fetching location data:", error);
      const locations = {
        ...this.state.locations,
        [`${latitude},${longitude}`]: "Unknown",
      };
      this.setState({ locations });
    }
  };

  // display the location name instead of the coordinates
  renderLocation = (locationString) => {
    const { locations } = this.state;

    // only attempt to use the API if the location is in the form of coordinates
    if (this.isCoordinates(locationString)) {
      const { latitude, longitude } = this.splitLocationString(locationString);
      const key = `${latitude},${longitude}`;

      // display the location name after it's fetched
      if (locations[key]) {
        return locations[key];
      } else {
        this.fetchLocationName(latitude, longitude);
        return "loading...";
      }
      // sometimes the location is a name already, so just display that
    } else {
      return locationString;
    }
  };

  render = () => {
    const query = this.props.state.query;
    const loading = this.props.state.loading;
    const searched = this.props.state.searched;
    const sightings = this.props.state.sightings;
    const expandedNotes = this.state.expandedNotes;

    if (loading) {
      return <img className="loading" src={loadingImage} alt="loading"></img>;
    } else if (sightings.length === 0 && searched !== false && query) {
      return (
        <p className="sightings">
          No sightings found that match the search: "{query}"
        </p>
      );
    } else if (sightings.length === 0 && !query) {
      return <p className="sightings">No sighitngs at the moment</p>;
    } else {
      const sightingItems = sightings.map((item, index) => {
        // const imagePath = item.imagePath ? `http://jk911.brighton.domains/pangolin_api/${item.imagePath}` : {defaultImage};
        const deadOrAlive = item.deadOrAlive ? item.deadOrAlive : "Unknown";
        const deathCause = item.deathCause ? item.deathCause : "Unknown";
        const location = item.location
          ? this.renderLocation(item.location)
          : "Unknown";
        const notes = item.notes ? item.notes : "None";
        const notesClassName = expandedNotes ? "notes expanded" : "notes";

        return (
          <div key={index.toString()} className="item">
            {/* the src for the image should be imagePath, but getting the images from the server doesn't work */}
            <img
              className="pangolinImage"
              src={defaultImage}
              alt="a sighted pangolin"
              width="130"
              height="100"
            ></img>
            <p>
              <strong>Dead or Alive:</strong> {deadOrAlive}
            </p>
            <p>
              <strong>Death Cause:</strong> {deathCause}
            </p>
            <p>
              <strong>Location:</strong> {location}
            </p>
            <p className={notesClassName}>
              <strong>Notes:</strong> {notes}
            </p>
            {/* if the notes span more than two lines, hide the rest of them */}
            {notes.length > 120 && (
              <button className="notesButton" onClick={this.handleNotesStatus}>
                {expandedNotes ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        );
      });
      // the sightings list is not getting saved to the local storage because it's being cached using the service worker
      return <div className="sightings">{sightingItems}</div>;
    }
  };
}

export default SightingList;
