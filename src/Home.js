import React, { useState, useEffect } from "react";
import { storage, db, auth } from "./firebase";
import { Link } from "react-router-dom";
import "./App.css";
import Post from "./Post";
import logo from "./images/Timeflux_1Line.png";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import VideoUpload from "./videoUpload";
import firebase from "firebase";

function Home() {
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

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const [openPP, setOpenPP] = useState(false);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  //const [openPP, setOpenPP] = useState(false);
  // UseEffect -> runs a piece of code based on a specific condition

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

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile(
          {
            displayName: username,
            photoURL: null,
          },
          setOpenPP(true)
        );
      })
      .catch((error) => alert(error.message));

    setEmail("");
    setPassword("");
    setUsername("");
    setOpen(false);
    setOpenPP(true);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setEmail("");
    setPassword("");
    setUsername("");
    setOpenSignIn(false);
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

  return (
    <div>
      <div className="app">
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src={logo}
                  alt="timeflux logo"
                />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </Modal>

        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src={logo}
                  alt="timeflux logo"
                />
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </div>
        </Modal>
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

        <div className="app__header">
          <img className="app__headerImage" src={logo} alt="Header image" />
          {user ? (
            <div>
              <Button onClick={() => auth.signOut()}>Logout</Button>
              <Link
                to={{
                  pathname: "/profile",
                  data: [user],
                }}
              >
                {" "}
                My Profile{" "}
              </Link>
            </div>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
        </div>

        <div className="app__posts">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              ppurl={post.ppurl}
            />
          ))}
        </div>

        {user ? (
          <div className="post__noUpload">
            <VideoUpload username={user?.displayName} ppurl={user?.photoURL} />
            <script>location.reload();</script>
          </div>
        ) : (
          <div className="post__noUpload">
            <h3 className="post__noUpload">
              Sorry, You need to login to upload
            </h3>
            <script>location.reload();</script>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
