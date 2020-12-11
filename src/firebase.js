import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB7l6V2WNrO1hCT_HV5_QkPe8BZAiAMuUA",
  authDomain: "timeflux.firebaseapp.com",
  databaseURL: "https://timeflux.firebaseio.com",
  projectId: "timeflux",
  storageBucket: "timeflux.appspot.com",
  messagingSenderId: "1069869131501",
  appId: "1:1069869131501:web:302831bd7047f8d587cee4",
  measurementId: "G-VY4X9VT79Z",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
