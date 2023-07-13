import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import './ChatMessages.css';

import { v4 as uuidv4 } from "uuid";

const ChatMessages = ({ messages }) => {

    let date = null;

    const renderDate = (text) => {
        const temp = text;
        date = text;
        return (
            <div className={`date__wrapper`}>
                <p className="date">{temp}</p>
            </div>
        );
    };

    return (
        <ScrollToBottom
            className="messages"
            initialScrollBehavior="smooth">
            {messages.map((message) => {
                return (
                    <React.Fragment
                        key={uuidv4()}>
                        {(!date || message.createdDate !== date) && renderDate(message.createdDate)}
                        <div
                            className={`message__wrapper ${message.fromSelf ? "sent" : "received"}`}
                        >
                            <span className="message__time">{message.createdTime}</span>
                            <div
                                className={`message__bubble`}
                            >
                                <div className="message__text">
                                    <p>
                                        {message.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </ScrollToBottom >
    );

};

export default ChatMessages;;