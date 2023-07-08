import React from "react";
import './Message.css';

import ReactEmoji from 'react-emoji'

const Message = ({ message: { user, text, isAdmin }, name }) => {
    const trimmedName = name.trim().toLowerCase();
    let isSentByCurrentUser = user === trimmedName;


    if (isAdmin) return (
        <div className="messageContainer justifyCenter">
            <div className="messageBox sentByAdmin noBackground">
                <p className="messageText colorDark fs-14 m-0">{ReactEmoji.emojify(text)}</p>
            </div>
        </div>
    )

    if (isSentByCurrentUser) return (
        <div className="messageContainer justifyEnd">
            <div className="messageBox backgroundBlue sentByUser">
                <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
            </div>
        </div>
    )

    return (
        <div className="messageContainer justifyStart">
            <div className="messageBox backgroundWhite notSentByUser">
                <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
            <p className="sentText pl-15">{user}</p>
        </div>
    )
};

export default Message;