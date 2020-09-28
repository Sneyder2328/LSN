import React, {useEffect} from "react";
import NewsFeed from "../NewsFeed/NewsFeed";
import CreatePost from "../CreatePost/CreatePost";
import './styles.scss'
import NavBar from "../NavBar/NavBar";
import DashBoardProfile from "../DashBoardProfile/DashBoardProfile";
import {connect} from "react-redux";
import {AppState} from "../../reducers";
import {getUserBasicInfo} from "../User/userActions";

type Props = { userId: string, getUserProfileData: (userId: string) => any };

const Home: React.FC<Props> = ({userId, getUserProfileData}) => {
    useEffect(() => {
        getUserProfileData(userId);
    }, [userId]);

    return (
        <div>
            <NavBar/>
            <main className='page-outer'>
                <div className='page-container'>
                    <div className='left-section'>
                        <DashBoardProfile/>
                    </div>
                    <div className='main-section'>
                        <CreatePost/>
                        <NewsFeed/>
                    </div>
                    <div className='right-section'>
                    </div>
                </div>
            </main>
        </div>
    );
};
const mapStateToProps = (state: AppState) => {
    return {
        userId: state.auth.userId
    }
};
export default connect(mapStateToProps, {getUserProfileData: getUserBasicInfo})(Home);