import React from "react";
import './Messages.css';

import ScrollToBottom from 'react-scroll-to-bottom';
import Message from "../Message/Message";

const renderMessages = (messages, name) => {
    return (
        messages.map((message, i) => (
            <div key={i}>
                <Message name={name} message={message} />
            </div>)
        )
    )
}

const Messages = ({ messages, name }) => (
    <ScrollToBottom className="messages">
        {renderMessages(messages, name)}
    </ScrollToBottom>
);

export default Messages;