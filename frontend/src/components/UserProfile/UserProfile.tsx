import React from "react";
import {UserObject} from "../User/userReducer";

type Props = {
    user: UserObject;
};
export const UserProfile: React.FC<Props> = ({user}) => {
    return (
        <div>
            {user.fullname}
        </div>
    );
};