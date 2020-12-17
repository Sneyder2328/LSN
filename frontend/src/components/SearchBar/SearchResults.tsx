import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from './styles.module.scss'
import { UserSearch } from "../../modules/Search/searchReducer";
import { AppState } from "../../modules/rootReducer";
import { ProfilePhoto } from "../ProfilePhoto/ProfilePhoto";
import { userLink } from "../../api";

const Profile: React.FC<{ profile: UserSearch }> = ({ profile }) => {
    return (
        <Link className={styles.person} to={userLink(profile.username)}>
            <ProfilePhoto size={'small1'} url={profile.profilePhotoUrl} />
            <div className={styles.details}>
                <p className={styles.fullname}><strong>{profile.fullname}</strong></p>
                <p className={styles.username}>@{profile.username}</p>
            </div>
        </Link>
    );
};

type Props = {
    query: string,
    people: Array<UserSearch>
};

const SearchResults: React.FC<Props> = ({ people }) => {
    return (
        <div className={styles.searchResults}>
            {
                people.map((profile) => <Profile key={profile.userId} profile={profile} />)
            }
        </div>
    );
};
const mapStateToProps = (state: AppState, ownProps: { query: string }): { people: Array<UserSearch> } => {
    return {
        people: state.search.queries[ownProps.query] ? state.search.queries[ownProps.query].map((userId: string) => state.search.users[userId]) : []
    };
};

export default connect(mapStateToProps, {})(SearchResults);