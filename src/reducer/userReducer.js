export const initialState = {
  user: false,
  driveFiles: [],
  folderID: "root",
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_DRIVE_FILES: "SET_DRIVE_FILES",
  SET_FOLDER_ID: "SET_FOLDER_ID",
};

const userReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_DRIVE_FILES:
      return {
        ...state,
        driveFiles: action.driveFiles,
      };
    case actionTypes.SET_FOLDER_ID:
      return {
        ...state,
        folderID: action.folderID,
      };
    default:
      return state;
  }
};

export default userReducer;
