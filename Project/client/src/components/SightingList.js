import React from "react";

class SightingList extends React.Component {
  render = () => {
    const query = this.props.state.query;
    const loading = this.props.state.loading;
    const searched = this.props.state.searched;
    const sightings = this.props.state.sightings;

    if (loading) {
      return <p>Loading...</p>;
    } else if (sightings.length === 0 && searched !== false) {
      return <p>No sightings found that match the search: "{query}"</p>;
    } else {
      const sightingItems = sightings.map((item, index) => {
        const imagePath = item.imagePath ? item.imagePath : "No image";
        const deadOrAlive = item.deadOrAlive ? item.deadOrAlive : "Unknown";
        const deathCause = item.deathCause ? item.deathCause : "Unknown";
        const location = item.location ? item.location : "Unknown";
        const notes = item.notes ? item.notes : "None";

        return (
          <div key={index.toString()} className="item">
            <p>Image Path: {imagePath}</p>
            <img src={imagePath} alt="a sighted pangolin" width="100" height="100"></img>
            <p>Dead or Alive: {deadOrAlive}</p>
            <p>Death Cause: {deathCause}</p>
            <p>Location: {location}</p>
            <p>Notes: {notes}</p>
          </div>
        );
      });
      return <div className="sightings">{sightingItems}</div>;
    }
  };
}

export default SightingList;