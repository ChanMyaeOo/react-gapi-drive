import React from "react";
import { useStateValue } from "./context/UserStateProvider";
import "./Home.css";
import { actionTypes } from "./reducer/userReducer";

let FOLDER_LEVEL = 0;
let FOLDER_NAME = "";
let FOLDER_ID = "";
let FOLDER_PERMISSION = true;
let NO_OF_FILES = 1000;
let DRIVE_FILES = [];
let FILE_COUNTER = 0;
let FOLDER_ARRAY = [];

function Home({ DRIVE_FILES, getDriveFiles }) {
  const [{ user }, dispatch] = useStateValue();

  console.log(DRIVE_FILES[0], "DDDDD ...");

  const handleFolderClick = (e) => {
    // console.log(e.currentTarget.attributes["data-level"].value);
    browseFolder(e, 0);
  };

  const browseFolder = (e, flag) => {
    // FOLDER_ID = e.currentTarget.attributes["data-id"].value;
    dispatch({
      type: actionTypes.SET_FOLDER_ID,
      folderID: e.currentTarget.attributes["data-id"].value,
    });
    FOLDER_NAME = e.currentTarget.attributes["data-name"].value;
    FOLDER_LEVEL = parseInt(e.currentTarget.attributes["data-level"].value);
    FOLDER_PERMISSION = e.currentTarget.attributes["data-has-permission"].value;

    if (typeof FOLDER_NAME === "undefined") {
      FOLDER_NAME = "";
      FOLDER_ID = "root";
      FOLDER_LEVEL = 0;
      FOLDER_PERMISSION = true;
      FOLDER_ARRAY = [];
    } else if (FOLDER_LEVEL == FOLDER_ARRAY.length && FOLDER_LEVEL > 0) {
      // do nothing
    } else if (FOLDER_LEVEL < FOLDER_ARRAY.length) {
      let tmpArray = cloneObject(FOLDER_ARRAY);
      FOLDER_ARRAY = [];

      for (let i = 0; i < tmpArray.length; i++) {
        FOLDER_ARRAY.push(tmpArray[i]);
        if (tmpArray[i].Level >= FOLDER_LEVEL) {
          break;
        }
      }
    } else {
      //breadcrumb navigation data insert
      let fd = {
        Name: FOLDER_NAME,
        ID: FOLDER_ID,
        Level: FOLDER_LEVEL,
        Permission: FOLDER_PERMISSION,

        // Title: $("#spanTitle").html(),
        // CreatedDate: $("#spanCreatedDate").html(),
        // ModifiedDate: $("#spanModifiedDate").html(),
        // Owner: $("#spanOwner").html(),
        // Size: $("#spanSize").html(),
        // Extension: $("#spanExtension").html(),
      };
      FOLDER_ARRAY.push(fd);
    }
    getDriveFiles();
  };

  function cloneObject(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    var temp = obj.constructor();
    for (var key in obj) {
      temp[key] = cloneObject(obj[key]);
    }
    return temp;
  }

  let markup = [];

  if (DRIVE_FILES.length > 0) {
    for (let i = 0; i < DRIVE_FILES.length; i++) {
      DRIVE_FILES[i].textContentURL = "";
      DRIVE_FILES[i].level = (parseInt(FOLDER_LEVEL) + 1).toString();
      DRIVE_FILES[i].parentID =
        DRIVE_FILES[i].parents.length > 0 ? DRIVE_FILES[i].parents[0].id : "";
      DRIVE_FILES[i].thumbnailLink = DRIVE_FILES[i].thumbnailLink || "";
      DRIVE_FILES[i].fileType =
        DRIVE_FILES[i].fileExtension == null ? "folder" : "file";
      DRIVE_FILES[i].permissionRole = DRIVE_FILES[i].userPermission.role;
      DRIVE_FILES[i].hasPermission =
        DRIVE_FILES[i].permissionRole == "owner" ||
        DRIVE_FILES[i].permissionRole == "writer";

      if (DRIVE_FILES[i]["exportLinks"] != null) {
        DRIVE_FILES[i].fileType = "file";
        DRIVE_FILES[i].textContentURL =
          DRIVE_FILES[i]["exportLinks"]["text/plain"];
      }
      let textTitle =
        DRIVE_FILES[i].fileType != "file"
          ? "Browse " + DRIVE_FILES[i].title
          : DRIVE_FILES[i].title;

      if (DRIVE_FILES[i].fileType != "file") {
        markup.push(
          <div className={`${DRIVE_FILES[i].fileType}-box`}>
            <div
              className="folder-icon"
              data-file-counter={`${i}`}
              data-level={`${DRIVE_FILES[i].level}`}
              data-parent={`${DRIVE_FILES[i].parentID}`}
              data-size={`${DRIVE_FILES[i].fileSize}`}
              data-id={`${DRIVE_FILES[i].id}`}
              title={`${textTitle}`}
              data-name={`${DRIVE_FILES[i].title}`}
              data-has-permission={`${DRIVE_FILES[i].hasPermission}`}
              onClick={handleFolderClick}
            >
              <div className="image-preview">
                <img src="./Images/folder.png" alt="" />
              </div>
            </div>
            <div className="item-title">{DRIVE_FILES[i].title}</div>
          </div>
        );
      } else if (DRIVE_FILES[i].thumbnailLink) {
        markup.push(
          <div className={`${DRIVE_FILES[i].fileType}-box`}>
            <div className="image-icon" data-file-counter={`${i}`}>
              <div className="image-preview">
                <a
                  href={`${DRIVE_FILES[i].thumbnailLink.replace(
                    "s220",
                    "s800"
                  )}`}
                  data-lightbox={`image-${i}`}
                >
                  <img src={`${DRIVE_FILES[i].thumbnailLink}`} />
                </a>
              </div>
            </div>
            <div className="item-title">{DRIVE_FILES[i].title}</div>
            <button className="send-btn" data-link={`${DRIVE_FILES[i].id}`}>
              Send
            </button>
          </div>
        );
      } else if (
        DRIVE_FILES[i].fileExtension === "txt" ||
        DRIVE_FILES[i].fileExtension === "xls" ||
        DRIVE_FILES[i].fileExtension === "xlsx" ||
        DRIVE_FILES[i].fileExtension === "pdf" ||
        DRIVE_FILES[i].fileExtension === "ppt" ||
        DRIVE_FILES[i].fileExtension === "pptx" ||
        DRIVE_FILES[i].fileExtension === "csv" ||
        DRIVE_FILES[i].fileExtension === "doc" ||
        DRIVE_FILES[i].fileExtension === "docx"
      ) {
        markup.push(
          <div className={`${DRIVE_FILES[i].fileType}-box`}>
            <div className="file-icon" data-file-counter={`${i}`}>
              <div className="image-preview">
                <img
                  src={`./Images/${DRIVE_FILES[i].fileExtension}-icon.png`}
                />
              </div>
            </div>
            <div className="item-title">{DRIVE_FILES[i].title}</div>
            <button className="send-btn" data-link={`${DRIVE_FILES[i].id}`}>
              Send
            </button>
          </div>
        );
      }
    }
    return <div>{markup}</div>;
  } else {
    return <div>Empty...</div>;
  }
}

export default Home;
