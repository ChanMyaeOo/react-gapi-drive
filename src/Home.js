import React from "react";
import { useStateValue } from "./context/UserStateProvider";
import "./Home.css";

let FOLDER_LEVEL = 0;

function Home({ DRIVE_FILES }) {
  const [{ user }, dispatch] = useStateValue();

  console.log(DRIVE_FILES[0], "DDDDD ...");

  // return DRIVE_FILES.map((driveFile) => {
  //   driveFile.fileType = driveFile.fileExtension == null ? "folder" : "file";
  //   console.log("TTTTTT  ... ", driveFile.fileType);
  //   return (
  //     <div className="file-icon">
  //       <div className="image-preview">
  //         {driveFile.fileType != "file" ? (
  //           <img src="./Images/folder.png" />
  //         ) : (
  //           <img src={`./Images/${driveFile.fileExtension}-icon.png`} />
  //         )}
  //         <div className="item-title">{driveFile.title}</div>
  //       </div>
  //     </div>
  //   );
  // });

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
            >
              <div className="image-preview">
                <img src="./Images/folder.png" alt="" />
              </div>
            </div>
            <div className="item-title">{DRIVE_FILES[i].title}</div>
            <button className="send-btn" data-link={`${DRIVE_FILES[i].id}`}>
              Send
            </button>
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
