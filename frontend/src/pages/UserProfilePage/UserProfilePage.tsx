import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {UserObject} from "../../modules/User/userReducer";
import {AppState} from "../../modules/rootReducer";
import {fetchProfile} from "../../modules/User/userActions";
import {ProfileInfo} from "./ProfileInfo/ProfileInfo";
import {LegalInfo} from "../../components/Legalnfo/LegalInfo";
import {UsersSuggestions} from "../../components/UsersSuggestions/UsersSuggestions";
import {Trends} from "../../components/Trends/Trends";
import {Friends} from "./Friends/Friends";
import {uuidv4Regex} from "../../utils/utils";
import {Photos} from "./Photos/Photos";
import {ThreeSectionsPage} from "../layouts/3Sections/3SectionsPage";
import { Posts } from "./Posts/Posts";

// const aspectRatio = 2.7;

type Props = {
    match: any;
};

export const UserProfilePage: React.FC<Props> = ({match}) => {
    const {params} = match;
    const {userIdentifier} = params;
    const dispatch = useDispatch()

    const users = useSelector((state: AppState) => state.users.entities)

    useEffect(() => {
        dispatch(fetchProfile(userIdentifier))
    }, [dispatch, userIdentifier]);

    const isId = uuidv4Regex.test(userIdentifier)

    const userId = isId ? userIdentifier : Object.keys(users).find((userId) => users[userId].username === userIdentifier)
    const userProfile: UserObject | undefined = users?.[userId || '']

    return (<ThreeSectionsPage LeftComponents={
        <>
            <Photos userId={userId}/>
            <Friends userId={userId}/>
        </>
    } MainComponents={
        <>
            <ProfileInfo userProfile={userProfile}/>
            <Posts userId={userId}/>
        </>
    } RightComponents={
        <>
            <UsersSuggestions/>
            <Trends/>
            <LegalInfo/>
        </>
    }/>)
};