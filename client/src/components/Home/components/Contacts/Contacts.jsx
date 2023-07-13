import React, { useEffect, useState } from "react";

import axios from "axios";
import './Contacts.css';
import { useNavigate } from "react-router-dom";

import io from 'socket.io-client';
import { logoutRoute, host } from "../../../../utils/APIRoutes";

const Contacts = ({ currentUser, contacts, changeChat, socket, onlineUsers }) => {

    const navigate = useNavigate();

    const [currentUserName, setCurrentUserName] = useState(null);
    const [currentUserImage, setCurrentUserImage] = useState(null);
    const [currentSelected, setCurrentSelected] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            if (!localStorage.getItem("chat-app-user")) {
                navigate('/');
            } else {
                const data = await JSON.parse(
                    localStorage.getItem("chat-app-user"));
                setCurrentUserImage(data.avatarImage);
                setCurrentUserName(data.username);
            };
        };
        fetchUser();
    }, []);

    const handleContactClick = (contact, idx) => {
        if (currentSelected === idx) {
            setCurrentSelected(null);
            changeChat(null);
        } else {
            setCurrentSelected(idx);
            changeChat(contact);
        }
    };

    const handleLogout = async () => {
        socket.current = io(host);
        socket.current.emit("remove-online-user", currentUser._id); // remove from online user

        // axios post last seen via logout module
        const { data } = await axios.post(`${logoutRoute}/${currentUser._id}`, {
            lastSeenAt: Date.now(),
        });

        if (data.status === 200) {
            localStorage.clear();
            navigate("/login");
        } else {
            console.error("Failed to logout");
        }
    };


    return (
        <div className="sidebar">
            <div className="currentUser">
                <div className="avatar">
                    <img
                        src={`data:image/svg+xml;base64,${currentUserImage}`}
                        alt="" />
                </div>
                <div className="username">
                    <h2>Welcome, {currentUserName}</h2>
                    <div
                        className="logout-btn"
                        onClick={() => handleLogout()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                        </svg>Logout
                    </div>

                </div>
            </div>
            <div className="contacts">
                {
                    contacts.map((contact, idx) => {
                        const isCurrentChatOnline = onlineUsers.includes(contact._id);
                        return <div
                            key={contact._id}
                            className={`contact ${idx === currentSelected ? "selected" : ""}`}
                            onClick={() => handleContactClick(contact, idx)}
                        >
                            <div className="avatar">
                                <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" />
                            </div>
                            <div className="username">
                                <h3>{contact.username}</h3>
                                <div className={`contact__activityIcon  ${isCurrentChatOnline ? "green" : "red"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="transparent" className="bi bi-dot" viewBox="3 3 10 10">
                                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>;
                    })
                }
            </div>
        </div>
    );
};

export default Contacts;