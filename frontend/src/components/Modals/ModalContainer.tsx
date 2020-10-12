import React from "react";
import {AppState} from "../../reducers";
import {useSelector} from "react-redux";
import {EditProfileModal} from "../EditProfile/EditProfileModal";

export const EDIT_PROFILE_MODAL = 'EditProfile'

const MODAL_COMPONENTS = {
    [EDIT_PROFILE_MODAL]: EditProfileModal
};

type Props = {
    modalType?: string;
};
export const ModalContainer: React.FC<Props> = () => {
    const modalType = useSelector((state: AppState) => state.modal.modalType)
    console.log('ModalContainer modalType=', modalType);
    if (!modalType) return null;

    // @ts-ignore
    const SpecificModal = MODAL_COMPONENTS[modalType]
    return <SpecificModal/>
}