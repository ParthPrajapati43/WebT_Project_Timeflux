import React, { useState, useEffect } from "react";
import { db, auth, storage } from "./firebase";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import firebase from "firebase";
import Post from "./Post";
import {
  Button,
  makeStyles,
  withStyles,
  Modal,
  TextField,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faEdit,
  faUpload,
  faUser,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./images/Timeflux_1Line.png";
import "./Profile.css";

function VProfile({username}) {
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

  const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 25,
      height: 25,
      border: `2px solid ${theme.palette.background.paper}`,
    },
  }))(Avatar);

  const classess = useStyles();
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const [modalStyle] = useState(getModalStyle);


  const [showfname, SetShowfname] = useState("");
  
  const [showlname, SetShowlname] = useState("");

  const [showbio, setShowbio] = useState("");

  const [user, setUser] = useState(null);
  //const [username, setUsername] = useState(props.username);
  const [posts, setPosts] = useState([]);

  const [ppurl, setPpurl] = useState("");

  const [navopen, setNavopen] = useState(false);

  

  

  
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
    if (user?.uid) {
        //console.log(props.username);
      db.collection("users")
      .where("uname","==",username)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).
          onSnapshot((snapshot) => {
            SetShowfname(snapshot.data()?.FName);
            SetShowlname(snapshot.data()?.LName);
            setShowbio(snapshot.data()?.Bio);
            setPpurl(snapshot.data()?.photoURL);
            //console.log(ppurl);
          });
        });
      })
        
        console.log(username);
    }
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
        //console.log('kkl');
      } else {
        // user has logged out...
        setUser(null);
        //console.log('llk');
      }
    });

    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user]);
  return (
    <div>
  
      <div className="profile__header">
        <nav className="navbar">
          <img className="app__headerImage" src={logo} alt="Header image" />
          <a
            className="avatar__button"
            href="#"
            onClick={() => setNavopen(!navopen)}
          >
            <Avatar alt={user ? user.displayName : "User"} src={ppurl} />
          </a>
          {navopen && user ? (
            <div className="dropdown">
              <a href="#" className="menu-item">
                <Link
                  className="menu-item profile"
                  to={{
                    pathname: "/Home",
                    data: [user],
                  }}
                >
                  {" "}
                  <FontAwesomeIcon className="icon" icon={faHome} />
                  HOME{" "}
                </Link>
              </a>
              <a href="#" className="menu-item">
                <Link
                  className="menu-item profile"
                  to={{
                    pathname: "/Profile",
                    data: [user],
                  }}
                >
                  {" "}
                  <FontAwesomeIcon className="icon" icon={faHome} />
                  MY PROFILE{" "}
                </Link>
              </a>
              <a href="#" className="menu-item" onClick={() => auth.signOut()}>
                <Link
                  className="menu-item profile"
                  to={{
                    pathname: "/Home",
                    data: [user],
                  }}
                >
                  {" "}
                  <FontAwesomeIcon className="icon" icon={faSignOutAlt} />
                  LOGOUT{" "}
                </Link>
              </a>
            </div>
          ) : (
            <></>
          )}
        </nav>

        <div className="user__name">
            <Avatar
              alt={user?.displayName}
              src={ppurl}
              style={{
                height: "70px",
                width: "70px",
                marginLeft: "40px",
                marginTop: "20px",
              }}
            />
          
          <h2>{username}</h2>
        </div>
        <div className="user__details">
          <div className="user__details__inner">
            <h3>
              {showfname} {showlname}
            </h3>
          </div>
          <div className="user__details__inner">
            <h3>{showbio}</h3>
            
          </div>
        </div>
      </div>
      <hr />

      <div className="user__posts">
        {posts.map(({ id, post }) =>
          username === post.username ? (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              ppurl={ppurl}
            />
          ) : (
            <div></div>
          )
        )}
      </div>
    </div>
  );
}

export default VProfile;
