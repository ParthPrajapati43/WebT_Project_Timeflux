import React, { useState, useEffect } from "react";
import { storage, db, auth } from "./firebase";
import { Link } from "react-router-dom";
import Post from "./Post";
import logo from "./images/Timeflux_1Line.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faUser,
  faUpload,
  faSignInAlt,
  faSignOutAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Avatar from "@material-ui/core/Avatar";
import { Button, Input, TextField } from "@material-ui/core";
import VideoUpload from "./videoUpload";
import Profile from "./Profile";
import Info from "./Info";
import firebase from "firebase";
import "./App.css";

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

  const [navopen, setNavopen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
        setNavopen(false);
      } else {
        // user has logged out...
        setUser(null);
        setNavopen(false);
      }
    });

    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    document.title = "TimeFlux";
    return () => {
      //cleanup
    };
  }, []);

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
        setUser(authUser.user);
        if (authUser.user?.uid) {
          //alert("ok");
          try {
            console.log("happy coding");
            db.collection("users")
              .doc(authUser.user.uid)
              .set({
                uname: username,
                FName: null,
                LName: null,
                Bio: null,
                photoURL: null,
              })
              .then(() => {
                //console.log("Updated, Party Hard");
              })
              .catch((error) => {
                alert(error.message);
              });
          } catch (error) {
            alert(error.message);
          }
        } else {
          //alert("Not Okay");
        }
        return authUser.user
          .updateProfile({
            displayName: username,
            photoURL: null,
          })
          .then(() => {
            setOpenPP(true);
          });
      })
      .catch((error) => alert(error.message));

    setEmail("");
    setPassword("");
    setUsername("");
    setOpen(false);
    //setOpenPP(true);
    setNavopen(false);
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
    setNavopen(false);
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
              <h2 className="modal__header">SIGN UP</h2>
              <div className="input-icons">
                <FontAwesomeIcon className="icon" icon={faUser} />
                <TextField
                  className="input-field"
                  type="text"
                  value={username}
                  id="outlined-basic"
                  label="Username"
                  variant="outlined"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="input-icons">
                <FontAwesomeIcon className="icon" icon={faEnvelope} />
                <TextField
                  className="input-field"
                  type="text"
                  value={email}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-icons">
                <FontAwesomeIcon className="icon" icon={faKey} />
                <TextField
                  className="input-field"
                  type="password"
                  value={password}
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                className="submit__button"
                variant="contained"
                color="primary"
                type="submit"
                onClick={
                  signUp /* (event) => {
                  (async () => {
                    const snapshot = await db
                      .collection("users")
                      .where("uname", "==", username)
                      .get();
                    if (snapshot.empty) {
                      //alert("signup triggered!");
                      signUp(event);
                    } else {
                      alert("Username already taken");
                      setEmail("");
                      setPassword("");
                      setUsername("");
                      setOpen(false);
                      setNavopen(false);
                    }
                  })();
                } */
                }
              >
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
              <h2 className="modal__header">SIGN IN</h2>

              <div className="input-icons">
                <FontAwesomeIcon className="icon" icon={faEnvelope} />
                <TextField
                  className="input-field"
                  type="text"
                  value={email}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-icons">
                <FontAwesomeIcon className="icon" icon={faKey} />
                <TextField
                  className="input-field"
                  type="password"
                  value={password}
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                className="submit__button"
                variant="contained"
                color="primary"
                type="submit"
                onClick={signIn}
              >
                Sign In
              </Button>
            </form>
          </div>
        </Modal>

        <nav className="navbar">
          <a href="#">
            <img className="app__headerImage" src={logo} alt="Header image" />
          </a>
          <a
            className="avatar__button"
            href="#"
            onClick={() => setNavopen(!navopen)}
          >
            <Avatar
              alt={user ? user.displayName : "User"}
              src={user?.photoURL}
            />
          </a>
          {navopen && user ? (
            <div className="dropdown">
              <a
                href="#"
                className="menu-item"
                onClick={() => {
                  setNavopen(false);
                }}
              >
                <Link
                  className="menu-item profile"
                  to={{
                    pathname: "/Profile",
                    data: [user],
                  }}
                >
                  <FontAwesomeIcon className="icon" icon={faUser} />
                  MY PROFILE
                </Link>
              </a>
              <a
                href="#"
                className="menu-item"
                onClick={() => {
                  auth.signOut();
                }}
              >
                <Link
                  className="menu-item profile"
                  to={{
                    pathname: "/Home",
                    data: [user],
                  }}
                >
                  <FontAwesomeIcon className="icon" icon={faSignOutAlt} />
                  LOGOUT
                </Link>
              </a>
            </div>
          ) : (
            <></>
          )}
          {navopen && !user ? (
            <div className="dropdown">
              <a href="#" className="menu-item" onClick={() => setOpen(true)}>
                <FontAwesomeIcon className="icon" icon={faUserPlus} />
                SIGN UP
              </a>
              <a
                href="#"
                className="menu-item"
                onClick={() => setOpenSignIn(true)}
              >
                <FontAwesomeIcon className="icon" icon={faSignInAlt} />
                SIGN IN
              </a>
            </div>
          ) : (
            <></>
          )}
        </nav>

        <div className="app__posts">
          {!user ? (
            <Info />
          ) : (
            posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                ppurl={post.ppurl}
              />
            ))
          )}
        </div>

        {user ? (
          <div className="post__noUpload">
            <VideoUpload username={user?.displayName} ppurl={user?.photoURL} />
            <script>location.reload();</script>
          </div>
        ) : (
          <div className="post__noUpload">
            <script>location.reload();</script>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
