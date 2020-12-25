import React, { useState } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import { TextField } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "./images/Timeflux_1Line.png";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import "./VideoUpload.css";

function VideoUpload({ username, ppurl }) {
  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classess = useStyles();
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [modalStyle] = useState(getModalStyle);
  const [openUpload, setOpenUpload] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`videos/${video.name}`).put(video);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress funtion ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function ...
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function ...
        storage
          .ref("videos")
          .child(video.name)
          .getDownloadURL()
          .then((url) => {
            // post video inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
              ppurl: ppurl,
            });

            setProgress(0);
            setCaption("");
            setVideo(null);
            setOpenUpload(false);
          });
      }
    );
  };

  return (
    <div className="videoupload">
      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        <div style={modalStyle} className={classess.paper}>
          <center>
            <img className="app__headerImage" src={logo} alt="timeflux logo" />
          </center>
          <h2 className="modal__header">UPLOAD A VIDEO</h2>
          <progress
            className="videoupload__progress"
            value={progress}
            max="100"
          />
          <TextField
            className="file__caption"
            size="small"
            type="text"
            value={caption}
            id="outlined-basic"
            label="Enter Caption"
            variant="outlined"
            fullWidth={true}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div className="file__select">
            <div id="file__selectt">
              <label>
                <input type="file" onChange={handleChange} />
                <span className="file__text">
                  <span className="upoad-icon">
                    <FontAwesomeIcon className="icon" icon={faUpload} />
                  </span>
                  {document.querySelector("#file__selectt input[type=file]")
                    ?.files?.length > 0 ? (
                    document.querySelector("#file__selectt input[type=file]")
                      ?.files[0]?.name
                  ) : (
                    <span>Choose a file…</span>
                  )}
                </span>
              </label>
            </div>

            <Button
              className="submit__button"
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleUpload}
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      <Button
        className="submit__popup"
        variant="contained"
        color="primary"
        type="submit"
        size="small"
        onClick={() => setOpenUpload(true)}
      >
        <FontAwesomeIcon className="icon" icon={faUpload} size="2x" />
        <span className="upload__text">UPLOAD</span>
      </Button>
    </div>
  );
}

export default VideoUpload;
