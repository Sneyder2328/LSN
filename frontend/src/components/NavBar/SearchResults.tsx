import React from "react";
import {connect} from "react-redux";
import {AppState} from "../../reducers";
import {UserSearch} from "./searchReducer";
import {Link} from "react-router-dom";

const Profile: React.FC<{ profile: UserSearch }> = ({profile}) => {
    return (
        <Link className='person' to={"/"+profile.username}>
            <img className='avatar' src='https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'/>
            <div>
                <p className='fullname'><strong>{profile.fullname}</strong></p>
                <p className='username'>@{profile.username}</p>
            </div>
        </Link>
    );
};

type Props = {
    query: string,
    people: Array<UserSearch>
};

const SearchResults: React.FC<Props> = ({people}) => {
    return (
        <div className='search-results'>
            {
                people.map((profile) => <Profile key={profile.userId} profile={profile}/>)
            }
        </div>
    );
};
const mapStateToProps = (state: AppState, ownProps: { query: string }): { people: Array<UserSearch> } => {
    return {
        people: state.search.queries[ownProps.query] ? state.search.queries[ownProps.query].map((userId) => state.search.users[userId]) : []
    };
};

export default connect(mapStateToProps, {})(SearchResults);