import React from "react";

export const ErrorMessage = (props: any) => {
    if (props.message) return (
        <div className='error-message'>
            <i className="fas fa-exclamation-triangle"/>
            <span>{props.message.message}</span>
        </div>
    );
    return (<div className='error-message'/>);
};