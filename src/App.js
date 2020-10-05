import React, { useEffect, useState } from "react";
import "./App.css";
import { useStateValue } from "./context/UserStateProvider";
import Home from "./Home";
import { actionTypes } from "./reducer/userReducer";

const SCOPES = ["https://www.googleapis.com/auth/drive", "profile"];
const CLIENT_ID =
  "220371405993-u9bqg2o63e3c6eih6abng8jgitqs0303.apps.googleusercontent.com";
// const FOLDER_ID = "root";
const NO_OF_FILES = 1000;
let DRIVE_FILES = [];
let FOLDER_LEVEL = 0;

function App() {
  const [{ user, driveFiles, folderID }, dispatch] = useStateValue();
  // const [{driveFiles}, dispatch] = useStateValue();
  const [userStatus, setUserStatus] = useState(false);

  const loadGoogleDriveApi = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    script.onload = () => {
      window.gapi.load("client:auth2", initClient);
    };

    document.body.appendChild(script);
  };

  const initClient = () => {
    window.gapi.client
      .init({
        clientId: CLIENT_ID,
        scope: SCOPES.join(" "),
      })
      .then(function () {
        // Listen for sign-in state changes.
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(
          window.gapi.auth2.getAuthInstance().isSignedIn.get()
        );
      });
  };

  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      // Dispatch action to Context API (data layer)
      dispatch({
        type: actionTypes.SET_USER,
        user: true,
      });

      getDriveFiles();
    } else {
      // Dispatch action to Context API (data layer)
      dispatch({
        type: actionTypes.SET_USER,
        user: false,
      });
    }
  };

  const getDriveFiles = () => {
    window.gapi.client.load("drive", "v2", getFiles);
    // fetchMarvinAPI();
  };

  const getFiles = () => {
    var query = "";

    query = "trashed=false and '" + folderID + "' in parents";
    // $(".button-opt").show();
    // $(".share-opt").show();
    //$(".trash-opt").show();

    var request = window.gapi.client.drive.files.list({
      maxResults: NO_OF_FILES,
      q: query,
    });

    request.execute(function (resp) {
      if (!resp.error) {
        const responseItems = resp.items;
        DRIVE_FILES = responseItems;

        dispatch({
          type: actionTypes.SET_DRIVE_FILES,
          driveFiles: responseItems,
        });
        // console.log(resp.items); //////////////////// Arrays of Google Drive Data
        // buildFiles();
        // return responseItems;
      } else {
        // showErrorMessage("Error: " + resp.error.message);
        alert("ERROR...");
      }
    });
  };

  useEffect(() => {
    loadGoogleDriveApi();
  }, [folderID]);

  const handleAuthClick = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = (event) => {
    window.gapi.auth2.getAuthInstance().signOut();
  };

  const handleHomeBtnClick = () => {
    dispatch({
      type: actionTypes.SET_FOLDER_ID,
      folderID: "root",
    });
  };

  return (
    <div className="app">
      {user ? (
        <div>
          {driveFiles.length > 0 ? (
            <>
              <div>
                <span className="home-btn" onClick={handleHomeBtnClick}>
                  HOME
                </span>
              </div>
              <Home DRIVE_FILES={driveFiles} getDriveFiles={getDriveFiles} />
            </>
          ) : (
            <div>Loading ...</div>
          )}
          <button onClick={handleSignoutClick}>Sign Out</button>
        </div>
      ) : (
        <div className="sign-in-container">
          <div className="sign-in">
            <div className="sign-in-title">SIGN IN</div>
            <div className="sign-in-subtitle">Use your Google Account</div>
            <button onClick={handleAuthClick}>Sign In</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
