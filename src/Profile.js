import React, { useState, useEffect } from "react";
import { useBetween } from "use-between";
import { Link } from "react-router-dom";
import { db, auth, storage } from "./firebase";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import Post from "./Post";
import { Button, makeStyles, Modal } from "@material-ui/core";

function Profile(props) {
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

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openPP, setOpenPP] = useState(false);

  const [user, setUser] = useState(props.user);
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);

  const RemovePP = (event) => {
    event.preventDefault();

    user.updateProfile({
      photoURL: null,
    });
  };

  const ChangePP = (event) => {
    event.preventDefault();
    setOpenPP(true);
  };

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

            setOpenPP(false);
            setProgress(0);
            setImage(null);
          });
      }
    );
  };

  useEffect(() => {
    // code
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // every time a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);
  return (
    <div>
      <Avatar className="post__avatar" alt="user avatar" src={user?.photoURL} />
      <Button onClick={RemovePP}>Remove Profile Picture</Button>
      <Button onClick={ChangePP}>Import New Profile Pic</Button>
      {
        <Modal open={openPP} onClose={() => setOpenPP(false)}>
          <div style={modalStyle} className={classes.paper}>
            <div className="PPupload">
              <h1>Upload a Profile Picture</h1>
              <progress
                className="PPupload__progress"
                value={progress}
                max="100"
              />
              <input type="file" onChange={handleChange} />
              <Button onClick={handleUpload}>Upload</Button>
            </div>
          </div>
        </Modal>
      }
      <h3>{user?.displayName}</h3>
      <div>
        {posts.map(({ id, post }) =>
          user.displayName == post.username ? (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              ppurl={post.ppurl}
            />
          ) : (
            <div></div>
          )
        )}
      </div>
    </div>
  );
}

export default Profile;
