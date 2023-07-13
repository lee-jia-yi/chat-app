import React, { useState, useEffect } from "react";
import './ChatInfoBar.css';

const msIn1Min = 60000;
const msIn1hour = msIn1Min * 60;
const msIn24hours = 24 * msIn1hour;

const ChatInfoBar = ({ currentChat, setCurrentChat, isCurrentChatOnline }) => {

    const [lastSeenText, setLastSeenText] = useState('');

    useEffect(() => {
        const diffInMs = Date.now() - currentChat.lastSeenAt;
        if ((Date.now() - currentChat.lastSeenAt) < msIn1hour) {
            const lastSeenMinsAgo = Math.floor(diffInMs / msIn1Min);
            if (lastSeenMinsAgo === 0) {
                setLastSeenText('Last seen recently');
            }
            else {
                setLastSeenText(`Last seen ${lastSeenMinsAgo} ${lastSeenMinsAgo === 1 ? "min" : "mins"} ago`);
            }
        } else if (diffInMs <= msIn24hours) {
            const lastSeenHoursAgo = Math.floor(diffInMs / msIn1hour);
            setLastSeenText(`Last seen ${lastSeenHoursAgo} ${lastSeenHoursAgo === 1 ? "hour" : "hours"} ago`);
        } else {
            const lastSeenDaysAgo = Math.floor(diffInMs / msIn24hours);
            setLastSeenText(`Last seen ${lastSeenDaysAgo} ${lastSeenDaysAgo === 1 ? "day" : "days"} ago`);
        }
    }, [isCurrentChatOnline, currentChat]);

    return (
        <div className="infoBar">
            <div className="leftInnerContainer">
                <div className={`activityIcon ${isCurrentChatOnline ? "green" : "red"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="transparent" className="bi bi-dot" viewBox="3 3 10 10">
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    </svg>
                </div>
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
                </div>

                <div className="chat-info">
                    <h3>{currentChat.username}</h3>
                    <p> {isCurrentChatOnline ?
                        "Online" :
                        lastSeenText
                    }</p>
                </div>
            </div>

            <div className="rightInnerContainer">
                <div
                    onClick={() => setCurrentChat(null)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--color-grey);" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ChatInfoBar;