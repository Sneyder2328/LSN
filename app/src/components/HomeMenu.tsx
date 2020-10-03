import {Platform} from "react-native";
import React, {useRef} from "react";
// @ts-ignore
import Menu, {MenuItem} from 'react-native-material-menu';
import {Appbar} from "react-native-paper";

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

type Props = {
    onPress: () => any;
}

export const HomeMenu: React.FC<Props> = ({onPress}) => {
    const menuRef = useRef(null)

    const hideMenu = () => {
        // @ts-ignore
        menuRef.current.hide();
    };

    const showMenu = () => {
        // @ts-ignore
        menuRef.current.show();
    };
    return (
        <Menu
            ref={menuRef} button={<Appbar.Action icon={MORE_ICON} color={'#fff'} onPress={showMenu}/>}>
            <MenuItem onPress={() => {
                onPress()
                hideMenu()
            }}>Log out</MenuItem>
        </Menu>
    );
}