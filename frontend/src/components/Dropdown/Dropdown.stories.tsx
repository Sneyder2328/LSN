import {Dropdown, DropdownProps} from "./Dropdown";
import {Meta, Story} from "@storybook/react";
import React from "react";
import {Button} from "../Button/Button";
import styles from "../../pages/UserProfile/styles.module.scss";

export default {
    title: 'Dropdown',
    component: Dropdown,
} as Meta;

const Template: Story<DropdownProps> = (args) => {
    return (<Dropdown {...args} trigger={<Button className={styles.actionBtn} onClick={() => console.log('hehe')}
                       label={'Click me'}/>}>

        <Dropdown.Item label={'Accept'} icon={() => <i className="fas fa-check"/>}/>
        <Dropdown.Item label={'Deny'} icon={() => <i className="fas fa-times"/>}/>
    </Dropdown>)
}

export const DropDown = Template.bind({});

DropDown.args = {};