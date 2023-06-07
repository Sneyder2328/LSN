import classNames from "classnames";
import styles from "./styles.module.scss";
import { Dropdown } from "../../Dropdown/Dropdown";
import React from "react";
import { logOutUser } from "../../../modules/Auth/authActions";
import { useDispatch } from "react-redux";
import stylesNav from '../styles.module.scss'

export const OptionsDropDown = () => {
  const dispatch = useDispatch()
  const handleLogOut = () => dispatch(logOutUser());

  return (<Dropdown
    className={styles.list}
    trigger={<i className={classNames(stylesNav.icon, "fas fa-bars")} />}>
    <Dropdown.Item
      className={styles.option}
      label={'Settings'}
      onClick={() => {
        // TODO (Implement this feature to send to /settings)
        console.log('Settings clicked!');
      }}
      icon={() => <i className="fas fa-cog" />} />
    <Dropdown.Item
      className={styles.option}
      label={'Log out'}
      onClick={() => {
        handleLogOut()
      }}
      icon={() => <i className="fas fa-sign-out-alt" />} />
  </Dropdown>)
}