import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from './styles.module.scss'
import { UserSearch } from "../../modules/Search/searchReducer";
import { AppState } from "../../modules/rootReducer";
import { ProfilePhoto } from "../ProfilePhoto/ProfilePhoto";
import { userLink } from "../../api";
import classNames from "classnames";
// @ts-ignore
import Spinner from 'react-spinkit';

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
    query: string;
};

export const SearchResults: React.FC<Props> = ({ query }) => {
    const {isSearching, queries, users} = useSelector((state: AppState)=>state.search)
    const people: Array<UserSearch> = queries[query] ? queries[query].map((userId: string) => users[userId]) : []

    return (
        <div className={styles.searchResults}>
            {
                people.map((profile) => <Profile key={profile.userId} profile={profile} />)
            }
            <div className={classNames(styles.loading, {'hide': !isSearching || people.length !== 0})}>
                <Spinner name="ball-spin-fade-loader" color="aqua" className={classNames(styles.iconLoading)} />
            </div>
        </div>
    );
};
// const mapStateToProps = (state: AppState, ownProps: { query: string }): { people: Array<UserSearch> } => {
//     return {
//         people: state.search.queries[ownProps.query] ? state.search.queries[ownProps.query].map((userId: string) => state.search.users[userId]) : []
//     };
// };

// export default connect(mapStateToProps, {})(SearchResults);