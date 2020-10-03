import {MyAppState} from "./mainReducer";

export const migrations = {
    0: (state: MyAppState) => {
        return {
            ...state,
            auth: {
                ...state.auth,
                accessToken: "",
                refreshToken: "",
            }
        }
    }
}