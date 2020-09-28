import React from "react";
import {connect} from "react-redux";
import {AppState} from "../../reducers";
import {UserObject} from "../User/userReducer";
import './styles.scss'

const DashBoardProfile: React.FC<{ currentUser: UserObject }> = ({currentUser}) => {

    return (
        <div className='dashboard-profile'>
            <img className='cover-photo' src="https://newevolutiondesigns.com/images/freebies/galaxy-facebook-cover-1.jpg"
            />
            <img className='profile-photo' src="https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png"/>
            <div className='profile-name'>
                <p className='fullname'>{currentUser && currentUser.fullname}</p>
                <p className='username'>{currentUser && "@"+currentUser.username}</p>
            </div>
            <p>{currentUser && currentUser.description}</p>
        </div>
    );
};

const mapStateToProps = (state: AppState) => {
    return {
        currentUser: state.entities.users.entities[state.auth.userId]
    }
};
export default connect(mapStateToProps, {})(DashBoardProfile);