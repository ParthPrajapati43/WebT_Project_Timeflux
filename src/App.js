import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import logo from './images/Timeflux_1Line.png';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import VideoUpload from './videoUpload';

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
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  // UseEffect -> runs a piece of code based on a specific condition

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    // code
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is added, this code fires...
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      }))); 
    })
  }, [])

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setEmail('');
    setPassword('');
    setUsername('');
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setEmail('');
    setPassword('');
    setUsername('');
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
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
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
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
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


      <div className="app__header">
        <img
          className="app__headerImage"
          src={logo}
          alt="Header image" />
        {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>  
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
          
        )}
      </div>

      <div className="app__posts">
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
      </div>
      {user?.displayName ? (
        <div className="post__noUpload">
          <VideoUpload username={user.displayName} />
          <script>
            location.reload();
          </script>
        </div>
      ): (
        <div className="post__noUpload">
          <h3 className="post__noUpload">Sorry, You need to login to upload</h3>
          <script>
            location.reload();
          </script>
        </div>
      )}
    
    </div>
  );
}

export default App;