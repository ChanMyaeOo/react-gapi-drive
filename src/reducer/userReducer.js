export const initialState = {
    user: false,
    driveFiles: []
}

export const actionTypes = {
    SET_USER: 'SET_USER',
    SET_DRIVE_FILES: 'SET_DRIVE_FILES'
}

const userReducer = (state, action) => {
    switch(action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            }
        case actionTypes.SET_DRIVE_FILES:
            return {
                ...state,
                driveFiles: action.driveFiles
            }
        default:
            return state;
    }
}

export default userReducer;