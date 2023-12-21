import React from "react";
// import "../styles/RecordSighting.css";

class SightingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        image: null,
        imagePath: "",
        deadOrAlive: "Alive",
        deathCause: "Fence death: electrocution",
        location: "",
        notes: "",
      },
    };
  }
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((previousState) => ({
      formData: { ...previousState.formData, [name]: value },
    }));
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState((previousState) => ({
      formData: { ...previousState.formData, image: file },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", this.state.formData.image);
    formData.append("imagePath", this.state.formData.imagePath);
    formData.append("deadOrAlive", this.state.formData.deadOrAlive);
    formData.append("deathCause", this.state.formData.deathCause);
    formData.append("location", this.state.formData.location);
    formData.append("notes", this.state.formData.notes);

    // get users location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          formData.append("location", `${latitude}, ${longitude}`);
          // submit user's data to the database
          try {
            const response = await fetch(
              "https://jk911.brighton.domains/pangolin_api",
              {
                method: "POST",
                body: formData,
              }
            );
            if (response.ok) {
              console.log("Form submitted successfully");
            } else {
              console.error("Error submitting form: ", response.status);
            }
          } catch (err) {
            console.error("Error submitting form: ", err);
          }
          console.log(this.state.formData);
        },
        (error) => {
          console.error("Error handling location: ", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  };
  render = () => {
    const { formData } = this.state;
    return (
      <div>
        <form className="recordSightingForm" onSubmit={this.handleSubmit}>
          <div className="inputContainer ic1">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={this.handleFileChange}
            />
            <div className="cut"></div>
            <label htmlFor="image">Image: </label>
          </div>
          <div className="inputContainer ic2">
            <select
              id="deadOrAlive"
              name="deadOrAlive"
              value={formData.deadOrAlive}
              onChange={this.handleInputChange}
            >
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
            </select>
            <div className="cut"></div>
            <label htmlFor="deadOrAlive">Dead or Alive: </label>
          </div>
          <div className="inputContainer ic2">
            <select
              id="deathCause"
              name="deathCause"
              value={formData.deathCause}
              onChange={this.handleInputChange}
            >
              <option value="Fence death: electrocution">
                Fence death: electrocution
              </option>
              <option value="Fence death: non-electrified fence">
                Fence death: non-electrified fence
              </option>
              <option value="Road death">Road death</option>
              <option value="Other">Other</option>
              <option value="N/A">N/A</option>
            </select>
            <div className="cut"></div>
            <label htmlFor="deathCause">Death Cause: </label>
          </div>
          <div className="inputContainer ic2">
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={this.handleInputChange}
            />
            <div className="cut cutShort"></div>
            <label htmlFor="notes">Notes: </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };
}
export default SightingsForm;