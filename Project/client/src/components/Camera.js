import React from "react";
import Webcam from "react-webcam";

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
    this.state = {
      facingMode: "environment",
    };
  }

  // capture the image taken in the browser using the webcam
  capture = (e) => {
    e.preventDefault();
    const imageBase64 = this.webcamRef.current.getScreenshot();

    //convert the captured image from base64 to Blob
    const byteCharacters = atob(imageBase64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    //convert the Blob to a file object (backend requires it to be a file)
    const imageFile = new File([blob], "pangolin_image.jpeg", {
      type: "image/jpeg",
    });

    this.props.updateImage(imageFile, URL.createObjectURL(imageFile));
  };

  // allow the user to switch to the front or back camera
  toggleCamera = (e) => {
    e.preventDefault();
    this.setState((previousState) => ({
      facingMode:
        previousState.facingMode === "environment" ? "user" : "environment",
    }));
  };

  render = () => {
    return (
      <div>
        <Webcam
          className="camera"
          audio={false}
          ref={this.webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: this.state.facingMode }}
        />
        <button className="captureButton" onClick={this.capture}>
          Capture Photo
        </button>
        <button className="toggleButton" onClick={this.toggleCamera}>
          Toggle Camera
        </button>
      </div>
    );
  };
}

export default Camera;
