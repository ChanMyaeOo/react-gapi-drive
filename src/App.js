import React, { useEffect, useState } from 'react';
import './App.css';
import {  useStateValue } from './context/UserStateProvider';
import Home from './Home';
import { actionTypes } from './reducer/userReducer';

const SCOPES = ["https://www.googleapis.com/auth/drive", "profile"];
const CLIENT_ID =
  "220371405993-u9bqg2o63e3c6eih6abng8jgitqs0303.apps.googleusercontent.com";

function App() {

  const [{user}, dispatch] = useStateValue();
  const [userStatus, setUserStatus] = useState(false);

  const loadGoogleDriveApi = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      window.gapi.load("client:auth2", initClient);
    };

    document.body.appendChild(script);
  }


  const initClient = () => {
    window.gapi.client
      .init({
        clientId: CLIENT_ID,
        scope: SCOPES.join(" "),
      })
      .then(function () {
        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
       
      });
  }


  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      // Dispatch action to Context API (data layer)
      dispatch({
        type: actionTypes.SET_USER,
        user: true
      })
      
    } else {
      // Dispatch action to Context API (data layer)
      dispatch({
        type: actionTypes.SET_USER,
        user: false
      })
    }
  }


  useEffect(() => {
    loadGoogleDriveApi();
  }, [])


  const handleAuthClick = () => {
    window.gapi.auth2.getAuthInstance().signIn();

  }

  const handleSignoutClick = (event) => {
      window.gapi.auth2.getAuthInstance().signOut();
  }
  return (
    <div className="App">
      
      
      {
        user ? (
          <div>
            <Home />
            <button onClick={handleSignoutClick}>Sign Out</button>
          </div>
        ) : (
          <button onClick={handleAuthClick}>Sign In</button>
        )
      }
    </div>
  );
}

export default App;
