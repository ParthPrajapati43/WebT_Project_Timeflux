import React, { useState } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { storage, db, auth } from "./firebase";

function PPUpload({ user }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${user.displayName}`).put(image);

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
          .ref("images")
          .child(user.displayName)
          .getDownloadURL()
          .then((url) => {
            // post video inside db
            firebase.auth().currentUser.updateProfile({
              photoURL: url,
            });

            db.collection("users").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              imageUrl: url,
              uname: user.displayName,
            });

            //setOpenPP(false);
            setProgress(0);
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="PPupload">
      <h1>Upload a Profile Picture</h1>
      <progress className="PPupload__progress" value={progress} max="100" />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default PPUpload;
