import React, {useState} from "react";
import {Modal} from "../Modals/Modal";
import {hideModal} from "../Modals/modalsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../reducers";
import styles from "./styles.module.scss";
import {CoverPhoto} from "../commons/CoverPhoto";
import {ModalContent} from "../Modals/ModalContent";
import {ProfilePhoto} from "../commons/ProfilePhoto";
import {useForm} from "react-hook-form";
import {ImageFile, readImgFileContent} from "../../utils/utils";
import {MAX_FILE_SIZE} from "../../utils/constants";
import {updateProfile} from "../Auth/authActions";
// @ts-ignore
import Spinner from 'react-spinkit';

type EditProfileParams = {
    username: string;
    fullname: string;
    description: string;
};

export const EditProfileModal = () => {
    const {register, handleSubmit, errors, setError} = useForm<EditProfileParams>();
    const [profilePhotoFile, setProfilePhotoFile] = useState<ImageFile | undefined>(undefined);
    const [coverPhotoFile, setCoverPhotoFile] = useState<ImageFile | undefined>(undefined);
    const dispatch = useDispatch()
    const userId: string = useSelector((state: AppState) => state.auth.userId)!!
    const isUpdatingProfile: boolean = useSelector((state: AppState) => state.auth.isUpdatingProfile) || false
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const userProfile = users[userId]!!

    const onValidData = async (data: EditProfileParams) => {
        console.log('onValidData', data);
        // @ts-ignore
        const updated: boolean = await dispatch(
            updateProfile({userId, ...data, profilePhoto: profilePhotoFile, coverPhoto: coverPhotoFile})
        )
        if (updated) handleClose()
    }

    const onInvalidData = (errors: any) => {
        console.log('onInvalidData', errors);
    }

    const handleClose = () => {
        dispatch(hideModal())
    }

    const handleImg = async (event: React.ChangeEvent<HTMLInputElement>): Promise<ImageFile | void> => {
        // @ts-ignore
        const file = event?.target?.files?.[0];
        if (!file) return alert("File selected is undefined");
        console.log('file size', file.size);
        if (!file.type.match('image/'))
            return alert("Only jpg/jpeg and png files are allowed!");
        if (file.size > MAX_FILE_SIZE)
            return alert(`'${file.name}' is too large, please pick a smaller file`);
        const image = {file, name: file.name};
        return await readImgFileContent(image);
    }

    const onHandleProfileImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('onHandleProfileImg', event);
        const img = await handleImg(event)
        if (img) setProfilePhotoFile(img)
    };

    const onHandleCoverImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('onHandleCoverImg', event);
        const img = await handleImg(event)
        if (img) setCoverPhotoFile(img)
    };

    return (
        <Modal onClose={handleClose} onSave={handleSubmit(onValidData)} className={'mainSection'}>
            <Modal.Header>
                Edit Profile
            </Modal.Header>
            <ModalContent>
                <div className={styles.coverPhotoContainer}>
                    <CoverPhoto
                        className={styles.coverPhoto}
                        preview={coverPhotoFile}
                        url={userProfile.coverPhotoUrl}/>
                    <input id='coverFile'
                           className={styles.cameraIc}
                           type='file'
                           onChange={onHandleCoverImg}
                           accept=".png, .jpg, .jpeg"/>
                    <label htmlFor='coverFile'><i className="fas fa-camera"/></label>
                    {/*<i>X</i>*/}
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.profilePhotoContainer}>
                        <ProfilePhoto
                            className={styles.profilePhoto}
                            preview={profilePhotoFile}
                            url={userProfile.profilePhotoUrl}/>
                        <input id='profileFile'
                               className={styles.cameraIc}
                               type='file'
                               onChange={onHandleProfileImg}
                               accept=".png, .jpg, .jpeg"/>
                        <label htmlFor='profileFile'><i className="fas fa-camera"/></label>
                    </div>
                    <input className={styles.fullname} name="fullname" defaultValue={userProfile.fullname}
                           placeholder='Full name'
                           ref={register({
                               required: {value: true, message: 'Please enter your full name'},
                               minLength: {value: 5, message: 'This field needs to be at least 5 characters long'}
                           })}/>
                    <input className={styles.username} name="username" defaultValue={userProfile.username}
                           placeholder='Username'
                           ref={register({
                               required: {value: true, message: 'Please enter a username'},
                               pattern: {value: /^\w+$/, message: 'Username must contain only alphanumeric values'},
                               minLength: {value: 5, message: 'Username must be at least 5 characters long'}
                           })}/>
                    <input className={styles.description} name="description" defaultValue={userProfile.description}
                           placeholder='Description'
                           ref={register({
                               maxLength: {value: 500, message: 'Description must be at most 500 characters long'}
                           })}/>
                </div>
                {isUpdatingProfile && <div className={styles.loading}>
                    <Spinner name="ball-spin-fade-loader" color="aqua"/>
                </div>}
            </ModalContent>
        </Modal>
    )
}