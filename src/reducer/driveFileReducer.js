export const initialState = {
    driveFiles: []
}

export const driveActionTypes = {
    SET_DRIVE_FILES: 'SET_DRIVE_FILES'
}

const driveFileReducer = (state, action) => {
    switch(action.type) {
        case driveActionTypes.SET_DRIVE_FILES:
            return {
                ...state,
                driveFiles: action.driveFiles
            }
        default:
            return state;
    }
}
export default driveFileReducer;