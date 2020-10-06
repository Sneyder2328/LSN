import {MyAppState} from "./rootReducer";

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