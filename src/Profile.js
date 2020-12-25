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
import FaEdit from "./images/FaEdit.png";
import logo from "./images/Timeflux_1Line.png";
import "./Profile.css";

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
  const [openPP, setOpenPP] = useState(false);
  const [nameBox, setNameBox] = useState(false);
  const [bioBox, setBioBox] = useState(false);

  const [fname, setFname] = useState("");
  const [showfname, SetShowfname] = useState("");
  const [lname, setLname] = useState("");
  const [showlname, SetShowlname] = useState("");
  const [bio, setBio] = useState("");
  const [showbio, setShowbio] = useState("");

  const [user, setUser] = useState(props.user);
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);

  const [ppurl, setPpurl] = useState("");

  const [navopen, setNavopen] = useState(false);

  const RemovePP = (event) => {
    event.preventDefault();

    user.updateProfile({
      photoURL: null,
    });
    db.collection("users")
      .doc(user?.uid)
      .update({
        photoURL: null,
      })
      .then(() => {
        console.log("Updated, Party Hard");
      })
      .catch((error) => {
        alert(error.message);
      });
    db.collection("posts")
      .where("username", "==", user.displayName)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          db.collection("posts").doc(doc.id).update({
            ppurl: null,
          });
        });
      })
      .catch((error) => alert(error.message));

    setOpenPP(false);
  };

  const ChangePP = (event) => {
    event.preventDefault();
    setOpenPP(true);
  };

  const testing = (event) => {
    event.preventDefault();
    setFname(showfname);
    setLname(showlname);
    setNameBox(true);
  };

  const tst = (event) => {
    event.preventDefault();
    setBio(showbio);
    setBioBox(true);
  };

  const ChangeName = (event) => {
    event.preventDefault();
    console.log(user.uid);
    //alert("HEllo world");
    try {
      console.log("happy coding");
      db.collection("users")
        .doc(user?.uid)
        .update({
          FName: fname,
          LName: lname,
        })
        .then(() => {
          console.log("Updated, Party Hard");
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      alert(error.message);
    }
    //alert("Ok Google");
    setNameBox(false);
  };

  const ChangeBio = (event) => {
    event.preventDefault();
    try {
      console.log("happy coding");
      db.collection("users")
        .doc(user.uid)
        .update({
          Bio: bio,
        })
        .then(() => {
          console.log("Updated, Party Hard");
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      alert(error.message);
    }
    setBioBox(false);
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
            db.collection("users")
              .doc(user?.uid)
              .update({
                photoURL: url,
              })
              .then(() => {
                console.log("Updated, Party Hard");
              })
              .catch((error) => {
                alert(error.message);
              });
            db.collection("posts")
              .where("username", "==", user.displayName)
              .get()
              .then(function (querySnapshot) {
                querySnapshot.forEach((doc) => {
                  db.collection("posts").doc(doc.id).update({
                    ppurl: url,
                  });
                });
              })
              .catch((error) => alert(error.message));
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
    if (user?.uid) {
      db.collection("users")
        .doc(user?.uid)
        .onSnapshot((snapshot) => {
          SetShowfname(snapshot.data()?.FName);
          SetShowlname(snapshot.data()?.LName);
          setShowbio(snapshot.data()?.Bio);
          setPpurl(snapshot.data()?.photoURL);
          //console.log(ppurl);
        });
    }
  });
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
      <Modal open={openPP} onClose={() => setOpenPP(false)}>
        <div style={modalStyle} className={classess.paper}>
          <center>
            <img className="app__headerImage" src={logo} alt="timeflux logo" />
          </center>
          <h2 className="modal__header">SET YOUR PROFILE PICTURE</h2>
          <progress className="PPupload__progress" value={progress} max="100" />
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
          </div>

          <div className="PP_buttons">
            <Button
              className="submit__button"
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleUpload}
            >
              Upload
            </Button>
            <Button
              className="submit__button"
              variant="contained"
              color="primary"
              type="submit"
              onClick={RemovePP}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={nameBox} onClose={() => setNameBox(false)}>
        <div style={modalStyle} className={classess.paper}>
          <center>
            <img className="app__headerImage" src={logo} alt="timeflux logo" />
          </center>
          <h2 className="modal__header">SET YOUR NAME</h2>
          <div className="input-icons">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <TextField
              className="input-field"
              type="text"
              value={fname}
              id="outlined-basic"
              label="First Name"
              variant="outlined"
              onChange={(e) => setFname(e.target.value)}
            />
          </div>
          <div className="input-icons">
            <FontAwesomeIcon className="icon" icon={faUser} />
            <TextField
              className="input-field"
              type="text"
              value={lname}
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
          <div className="PP_buttons">
            <Button
              className="submit__button"
              variant="contained"
              color="primary"
              type="submit"
              onClick={ChangeName}
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={bioBox} onClose={() => setBioBox(false)}>
        <div style={modalStyle} className={classess.paper}>
          <center>
            <img className="app__headerImage" src={logo} alt="timeflux logo" />
          </center>
          <h2 className="modal__header">SET YOUR SHORT BIOGRAPHY</h2>
          <div className="input-icons">
            <FontAwesomeIcon className="icon" icon={faAddressCard} />
            <TextField
              className="input-field"
              type="text"
              value={bio}
              id="outlined-multiline-static"
              label="Short Biography"
              variant="outlined"
              multiline
              rows={4}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="PP_buttons">
            <Button
              className="submit__button"
              variant="contained"
              color="primary"
              type="submit"
              onClick={ChangeBio}
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>
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
          <Badge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <a type="button" onClick={ChangePP} style={{ cursor: "pointer" }}>
                <SmallAvatar alt="Edit" src={FaEdit} />
              </a>
            }
          >
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
          </Badge>
          <h2>{user?.displayName}</h2>
        </div>
        <div className="user__details">
          <div className="user__details__inner">
            <h3>
              {showfname} {showlname}
            </h3>
            <a type="button" onClick={testing}>
              <FontAwesomeIcon className="icon" icon={faEdit} />
            </a>
          </div>
          <div className="user__details__inner">
            <h3>{showbio}</h3>
            <a type="button" onClick={tst}>
              <FontAwesomeIcon className="icon" icon={faEdit} />
            </a>
          </div>
        </div>
      </div>
      <hr />

      <div className="user__posts">
        {posts.map(({ id, post }) =>
          user?.displayName === post.username ? (
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

export default Profile;
