import React, {useEffect} from "react";
import {UserProfile} from "../UserProfile/UserProfile";
import NavBar from "../NavBar/NavBar";
import {AppState} from "../../reducers";
import {connect} from "react-redux";
import {UserObject} from "../User/userReducer";

type Props = {
    user: UserObject;
    match: any;
};
const UserProfilePage: React.FC<Props> = ({user, match}) => {
    const {params} = match;
    const {username} = params;

    useEffect(() => {

    });

    return (
        <div>
            <NavBar/>
            <main className='page-outer'>
                <div className='page-container'>
                    <div className='left-section'>
                        <UserProfile user={user}/>
                    </div>
                    <div className='main-section'>
                        {username}
                    </div>
                    <div className='right-section'>

                    </div>
                </div>
            </main>
        </div>
    );
};

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        user: state.entities.users.entities[state.auth.userId]
    }
};
export default connect(mapStateToProps, null)(UserProfilePage);