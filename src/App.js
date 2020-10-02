import React, { useEffect, useState } from 'react';
import './App.css';
import {  useStateValue } from './context/UserStateProvider';
import Home from './Home';
import { actionTypes } from './reducer/userReducer';

const SCOPES = ["https://www.googleapis.com/auth/drive", "profile"];
const CLIENT_ID =
  "220371405993-u9bqg2o63e3c6eih6abng8jgitqs0303.apps.googleusercontent.com";
const FOLDER_ID = "root";
const NO_OF_FILES = 1000;
let DRIVE_FILES = [];
let FOLDER_LEVEL = 0;

function App() {

  const [{user, driveFiles}, dispatch] = useStateValue();
  // const [{driveFiles}, dispatch] = useStateValue();
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

      getDriveFiles();
      console.log('SIGNED IN ...')
      
    } else {
      // Dispatch action to Context API (data layer)
      dispatch({
        type: actionTypes.SET_USER,
        user: false
      })
      console.log('SIGNED OUT >>>')
    }
  }

  const getDriveFiles = () => {
    window.gapi.client.load("drive", "v2", getFiles);
    // fetchMarvinAPI();
  }

  const getFiles = () => {
    var query = "";
  
    query = "trashed=false and '" + FOLDER_ID + "' in parents";
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
        console.log(DRIVE_FILES, 'drive files ...');

        dispatch({
          type: actionTypes.SET_DRIVE_FILES,
          driveFiles: responseItems
        })
        // console.log(resp.items); //////////////////// Arrays of Google Drive Data
        // buildFiles();
        // return responseItems;
      } else {
        // showErrorMessage("Error: " + resp.error.message);
        alert('ERROR...')
      }
    });
  }


  // const buildFiles = () => {
  //   let fText = "";
  //   if (DRIVE_FILES.length > 0) {
  //     for (let i = 0; i < DRIVE_FILES.length; i++) {
  //       DRIVE_FILES[i].textContentURL = "";
  //       DRIVE_FILES[i].level = (parseInt(FOLDER_LEVEL) + 1).toString();
  //       DRIVE_FILES[i].parentID =
  //         DRIVE_FILES[i].parents.length > 0 ? DRIVE_FILES[i].parents[0].id : "";
  //       DRIVE_FILES[i].thumbnailLink = DRIVE_FILES[i].thumbnailLink || "";
  //       DRIVE_FILES[i].fileType =
  //         DRIVE_FILES[i].fileExtension == null ? "folder" : "file";
  //       DRIVE_FILES[i].permissionRole = DRIVE_FILES[i].userPermission.role;
  //       DRIVE_FILES[i].hasPermission =
  //         DRIVE_FILES[i].permissionRole == "owner" ||
  //         DRIVE_FILES[i].permissionRole == "writer";
  
  //       if (DRIVE_FILES[i]["exportLinks"] != null) {
  //         DRIVE_FILES[i].fileType = "file";
  //         DRIVE_FILES[i].textContentURL =
  //           DRIVE_FILES[i]["exportLinks"]["text/plain"];
  //       }
  //       let textTitle =
  //         DRIVE_FILES[i].fileType != "file"
  //           ? "Browse " + DRIVE_FILES[i].title
  //           : DRIVE_FILES[i].title;
  
  //       fText += "<div class='" + DRIVE_FILES[i].fileType + "-box'>";
  //       if (DRIVE_FILES[i].fileType != "file") {
  //         fText +=
  //           "<div class='folder-icon' data-file-counter='" +
  //           i +
  //           "' data-level='" +
  //           DRIVE_FILES[i].level +
  //           "' data-parent='" +
  //           DRIVE_FILES[i].parentID +
  //           "' data-size='" +
  //           DRIVE_FILES[i].fileSize +
  //           "' data-id='" +
  //           DRIVE_FILES[i].id +
  //           "' title='" +
  //           textTitle +
  //           "' data-name='" +
  //           DRIVE_FILES[i].title +
  //           "' data-has-permission='" +
  //           DRIVE_FILES[i].hasPermission +
  //           "'><div class='image-preview'><img src='./Images/folder.png'/></div></div>";
  //       } else {
  //         if (DRIVE_FILES[i].thumbnailLink) {
  //           fText +=
  //             "<div class='image-icon' data-file-counter='" +
  //             i +
  //             "' ><div class='image-preview'><a href='" +
  //             DRIVE_FILES[i].thumbnailLink.replace("s220", "s800") +
  //             "' data-lightbox='image-" +
  //             i +
  //             "'><img src='" +
  //             DRIVE_FILES[i].thumbnailLink +
  //             "'/></a></div></div>";
  //         } else {
  //           if (
  //             DRIVE_FILES[i].fileExtension === "txt" ||
  //             DRIVE_FILES[i].fileExtension === "xls" ||
  //             DRIVE_FILES[i].fileExtension === "xlsx" ||
  //             DRIVE_FILES[i].fileExtension === "pdf" ||
  //             DRIVE_FILES[i].fileExtension === "ppt" ||
  //             DRIVE_FILES[i].fileExtension === "pptx" ||
  //             DRIVE_FILES[i].fileExtension === "csv" ||
  //             DRIVE_FILES[i].fileExtension === "doc" ||
  //             DRIVE_FILES[i].fileExtension === "docx"
  //           ) {
  //             fText +=
  //               "<div class='file-icon' data-file-counter='" +
  //               i +
  //               "' ><div class='image-preview'><img src='./Images/" +
  //               DRIVE_FILES[i].fileExtension +
  //               "-icon.png" +
  //               "'/></div></div>";
  //           } else {
  //             fText +=
  //               "<div class='file-icon' data-file-counter='" +
  //               i +
  //               "' ><div class='image-preview'><img src='./Images/undefined-icon.png" +
  //               "'/></div></div>";
  //           }
  //         }
  //       }
        
  //       fText += "<div class='item-title'>" + DRIVE_FILES[i].title + `</div><button class='send-btn' data-link="${DRIVE_FILES[i].id}">Send</button>`;
        
  //       fText += "</div>";
  //       //closing div
  //       fText += "</div>";
  //     }
  //   } else {
  //     fText = "Empty";
  //   }
  //   // hideStatus();
  //   const driveContentDiv = document.getElementById('drive-content')
  //   driveContentDiv.insertAdjacentHTML('beforeend', fText)
  //   // $("#drive-content").html(fText);
  //   // initDriveButtons();
  //   // hideLoading();
  // }


  // const buildFiles = () => {
  //   if (DRIVE_FILES.length > 0) {
  //     for (let i = 0; i < DRIVE_FILES.length; i++) {
  //       DRIVE_FILES[i].textContentURL = "";
  //       DRIVE_FILES[i].level = (parseInt(FOLDER_LEVEL) + 1).toString();
  //       DRIVE_FILES[i].parentID =
  //         DRIVE_FILES[i].parents.length > 0 ? DRIVE_FILES[i].parents[0].id : "";
  //       DRIVE_FILES[i].thumbnailLink = DRIVE_FILES[i].thumbnailLink || "";
  //       DRIVE_FILES[i].fileType =
  //         DRIVE_FILES[i].fileExtension == null ? "folder" : "file";
  //       DRIVE_FILES[i].permissionRole = DRIVE_FILES[i].userPermission.role;
  //       DRIVE_FILES[i].hasPermission =
  //         DRIVE_FILES[i].permissionRole == "owner" ||
  //         DRIVE_FILES[i].permissionRole == "writer";
  
  //       if (DRIVE_FILES[i]["exportLinks"] != null) {
  //         DRIVE_FILES[i].fileType = "file";
  //         DRIVE_FILES[i].textContentURL =
  //           DRIVE_FILES[i]["exportLinks"]["text/plain"];
  //       }
  //       let textTitle =
  //         DRIVE_FILES[i].fileType != "file"
  //           ? "Browse " + DRIVE_FILES[i].title
  //           : DRIVE_FILES[i].title;


  //      if(DRIVE_FILES[i].fileType != "file") {
  //        return(
  //          <div className={`${DRIVE_FILES[i].fileType}-box`}>
  //            <div className='folder-icon' 
  //             data-file-counter={`${i}`}
  //             data-level={`${DRIVE_FILES[i].level}`}
  //             data-parent={`${DRIVE_FILES[i].parentID}`}
  //             data-size={`${DRIVE_FILES[i].fileSize}`}
  //             data-id={`${DRIVE_FILES[i].id}`}
  //             title={`${textTitle}`}
  //             data-name={`${DRIVE_FILES[i].title}`}
  //             data-has-permission={`${DRIVE_FILES[i].hasPermission}`}
  //             >
  //               <div className="image-preview">
  //                 <img src="./assets/folder.png" alt="" />
  //               </div>
  //             </div>
  //          </div>
  //        );
  //      } else if(DRIVE_FILES[i].thumbnailLink) {
  //        return(
  //           <div className={`${DRIVE_FILES[i].fileType}-box`}>
  //           <div className='image-icon'
  //             data-file-counter={`${i}`}
  //           >
  //             <div className='image-preview'>
  //               <a href={`${DRIVE_FILES[i].thumbnailLink.replace("s220", "s800")}`}
  //                 data-lightbox={`image-${i}`} >
  //                 <img src={`${DRIVE_FILES[i].thumbnailLink}`} />
  //               </a>
  //             </div>
  //           </div>
  //         </div>
  //        ); 
  //      } else if(
  //       DRIVE_FILES[i].fileExtension === "txt" ||
  //       DRIVE_FILES[i].fileExtension === "xls" ||
  //       DRIVE_FILES[i].fileExtension === "xlsx" ||
  //       DRIVE_FILES[i].fileExtension === "pdf" ||
  //       DRIVE_FILES[i].fileExtension === "ppt" ||
  //       DRIVE_FILES[i].fileExtension === "pptx" ||
  //       DRIVE_FILES[i].fileExtension === "csv" ||
  //       DRIVE_FILES[i].fileExtension === "doc" ||
  //       DRIVE_FILES[i].fileExtension === "docx"
  //      ) {
  //       return(
  //         <div className={`${DRIVE_FILES[i].fileType}-box`}>
  //           <div className='file-icon'
  //             data-file-counter={`${i}`}
  //           >
  //             <div className="image-preview">
  //               <img src={`./assets/${DRIVE_FILES[i].fileExtension}-icon.png`}/>
  //             </div>
  //           </div>
  //         </div>
  //       )
  //      } else {
  //        return(
  //          <div className={`${DRIVE_FILES[i].fileType}-box`}>
  //            <div className='file-icon' 
  //             data-file-counter={`${i}`}
  //            >
  //              <div className='image-preview'>
  //                <img src='./assets/undefined-icon.png'/>
  //              </div>
  //            </div>
  //           <div className='item-title'>${DRIVE_FILES[i].title}</div>
  //           <button className='send-btn' data-link={`${DRIVE_FILES[i].id}`}>Send</button>
  //          </div>
  //        )
  //      }
       
  //     }
  //   } else {
  //     return(
  //       <div>Empty</div>
  //     )
  //   }
  // }


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
            {
              driveFiles.length > 0 ? (
                <Home DRIVE_FILES={driveFiles}/>
              ) : (
                <div>Loading ...</div>
              )
            }
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
