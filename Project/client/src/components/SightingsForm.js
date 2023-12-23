import React from "react";
import Camera from "./Camera";

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
      previewImageUrl: null,
      cameraOn: false,
    };
  };

  updateImage = (image, previewImageUrl) => {
    this.setState((previousState) => ({
      formData: {...previousState.formData, image: image},
      previewImageUrl: previewImageUrl,
    }));
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((previousState) => ({
      formData: { ...previousState.formData, [name]: value },
    }));
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    const previewImageUrl = URL.createObjectURL(file);
    this.setState((previousState) => ({
      formData: { ...previousState.formData, image: file },
      previewImageUrl: previewImageUrl,
  }));
  };

  handleCameraStatus = () => {
    this.setState((previousState) => ({
      cameraOn: !previousState.cameraOn
    }))
  }

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
          <div className="inputContainer">
            <label htmlFor="image">Image: </label>
            <div className="icFile">
              <input
                className="recordSightingInput"
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={this.handleFileChange}
              />
              <button className="takePictureButton" type="button" onClick={this.handleCameraStatus}>{this.state.cameraOn ? "Hide Camera" : "Take Picture"}</button>
              {this.state.previewImageUrl && (
                <img className="imagePreview" src={this.state.previewImageUrl} alt="preview of upload" width={80} height={60}/>
              )}
            </div>
            <div className="cut"></div>
          </div>

          {this.state.cameraOn && (<Camera updateImage = {this.updateImage} />)}

          <div className="inputContainer">
            <label htmlFor="deadOrAlive">Dead or Alive: </label>
            <select
              className="recordSightingSelect"
              id="deadOrAlive"
              name="deadOrAlive"
              value={formData.deadOrAlive}
              onChange={this.handleInputChange}
            >
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
            </select>
            <div className="cut"></div>
          </div>
          <div className="inputContainer">
            <label htmlFor="deathCause">Death Cause: </label>
            <select
              className="recordSightingSelect"
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
          </div>
          <div className="inputContainer">
            <label htmlFor="notes">Notes: </label>
            <textarea
              className="recordSightingTextarea"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={this.handleInputChange}
            />
            <div className="cut cutShort"></div>
          </div>
          <button className="recordSightingButton" type="submit">Submit</button>
        </form>
      </div>
    );
  };
}
export default SightingsForm;