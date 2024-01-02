import React from "react";
import temporaryImage from "../images/pangolin_1.jpg";

class SightingList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expandedNotes: false,
    };
  };

  handleNotesStatus = () => {
    this.setState((previousState) => ({
      expandedNotes: !previousState.expandedNotes,
    }));
  };

  render = () => {
    const query = this.props.state.query;
    const loading = this.props.state.loading;
    const searched = this.props.state.searched;
    const sightings = this.props.state.sightings;
    const expandedNotes = this.state.expandedNotes;

    if (loading) {
      return <p>Loading...</p>;
    } else if (sightings.length === 0 && searched !== false) {
      return <p className="sightings">No sightings found that match the search: "{query}"</p>;
    } else {
      const sightingItems = sightings.map((item, index) => {
        // const imagePath = item.imagePath ? `http://jk911.brighton.domains/pangolin_api/${item.imagePath}` : "No image";
        const deadOrAlive = item.deadOrAlive ? item.deadOrAlive : "Unknown";
        const deathCause = item.deathCause ? item.deathCause : "Unknown";
        const location = item.location ? item.location : "Unknown";
        const notes = item.notes ? item.notes : "None";
        const notesClassName = expandedNotes ? "notes expanded" : "notes";

        return (
          <div key={index.toString()} className="item">
            <img className="pangolinImage" src={temporaryImage} alt="a sighted pangolin" width="130" height="100"></img>
            <p><strong>Dead or Alive:</strong> {deadOrAlive}</p>
            <p><strong>Death Cause:</strong> {deathCause}</p>
            <p><strong>Location:</strong> {location}</p>
            <p className={notesClassName}><strong>Notes:</strong> {notes}</p>
            {/* if the notes span more than two lines, hide the rest of them */}
            {notes.length > 50 && (
              <button className="notesButton" onClick={this.handleNotesStatus}>
                {expandedNotes ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        );
      });
      return <div className="sightings">{sightingItems}</div>;
    }
  };
}

export default SightingList;