import React from "react";
import {UserObject} from "../User/userReducer";
import {useSelector} from "react-redux";
import {AppState} from "../../reducers";

type Props = {
    user: UserObject;
};
export const UserProfile: React.FC<Props> = ({user}) => {
    // useSelector((state: AppState) => state.)

    return (
        <div>
            {user.username}
        </div>
    );
};