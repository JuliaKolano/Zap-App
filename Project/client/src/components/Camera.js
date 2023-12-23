import React from "react";
import Webcam from 'react-webcam';

class Camera extends React.Component {

    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
    }

    capture = (e) => {
        e.preventDefault();
        const imageBase64 = this.webcamRef.current.getScreenshot();

        //convert the captured image from base64 to Blob
        const byteCharacters = atob(imageBase64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        //convert the Blob to a file object
        const imageFile = new File([blob], 'pangolin_image.jpeg', { type: 'image/jpeg' });

        this.props.updateImage(imageFile, URL.createObjectURL(imageFile));
    };

    render = () => {
        return (
            <div>
                <Webcam className="camera" audio={false} ref={this.webcamRef} screenshotFormat="image/jpeg" />
                <button onClick={this.capture}>Capture Photo</button>
            </div>
        );
    }
}

export default Camera;