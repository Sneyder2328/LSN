import {ProfilePhotoProps, ProfilePhoto} from "./ProfilePhoto";
import {Meta, Story} from "@storybook/react";
import React from "react";

export default {
    title: 'ProfilePhoto',
    component: ProfilePhoto,
    decorators: [(ProfilePhoto) =>
        <div style={{backgroundColor: '#0db7ff', display: 'inline-flex'}}>
            <ProfilePhoto/>
        </div>]
} as Meta

const Template: Story<ProfilePhotoProps> = (args) => <ProfilePhoto {...args}/>

export const DefaultIcon = Template.bind({})
DefaultIcon.args = {
    size: 'medium'
}

export const WithImage = Template.bind({})
WithImage.args = {
    url: 'https://res.cloudinary.com/dkflrjxwe/image/upload/v1602539091/postImages/160253907-1602539083614.jpg',
    size: 'medium'
}

export const WithBorder = Template.bind({})
WithBorder.args = {
    url: 'https://res.cloudinary.com/dkflrjxwe/image/upload/v1602539091/postImages/160253907-1602539083614.jpg',
    size: 'medium',
    border: true
}

export const Small2 = Template.bind({})
Small2.args = {
    url: 'https://res.cloudinary.com/dkflrjxwe/image/upload/v1602539091/postImages/160253907-1602539083614.jpg',
    size: 'small2'
}

export const Small1 = Template.bind({})
Small1.args = {
    url: 'https://res.cloudinary.com/dkflrjxwe/image/upload/v1602539091/postImages/160253907-1602539083614.jpg',
    size: 'small1'
}

export const Medium = Template.bind({})
Medium.args = {
    url: 'https://res.cloudinary.com/dkflrjxwe/image/upload/v1602539091/postImages/160253907-1602539083614.jpg',
    size: 'medium'
}

export const Large = Template.bind({})
Large.args = {
    url: 'https://res.cloudinary.com/dkflrjxwe/image/upload/v1602539091/postImages/160253907-1602539083614.jpg',
    size: 'large'
}