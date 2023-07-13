import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../../utils/APIRoutes";
import Contacts from "./components/Contacts/Contacts";
import DefaultChat from "./components/DefaultChat/DefaultChat";
import ChatContainer from "./components/Chat/ChatContainer";

import './Home.css';
import Loader from "../Loader/Loader";

import io from 'socket.io-client';

const Home = () => {
    const socket = useRef();

    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        async function fetchUser() {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            } else {
                const user = await JSON.parse(localStorage.getItem("chat-app-user"));
                setCurrentUser(user);
                if (!user.isAvatarImageSet) navigate("/setAvatar");
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-online-user", currentUser._id); // add to online user to socket

            // listen on online users from socket
            socket.current.on("get-online-users", (data) => {
                setOnlineUsers(data);
            });
        }
    }, [currentUser]);

    useEffect(() => {
        async function fetchContacts() {
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            if (data.status !== 200) return console.error('Failed to fetch contacts');
            setContacts(data.data);
        }
        if (currentUser) {
            fetchContacts();
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            // listen on changes in anyone's last seen emitted from BE
            socket.current.on('update-last-seen', ({ userId, lastSeenAt }) => {
                contacts.map((contact) => {
                    if (contact._id === userId) {
                        contact.lastSeenAt = lastSeenAt;
                        return;
                    }
                });
                setContacts(contacts);
            });

        }
    }, [onlineUsers]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    const renderChatBody = () => {
        if (!currentChat) return (
            <DefaultChat currentUser={currentUser} />
        );
        return (
            <ChatContainer
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                currentUser={currentUser}
                socket={socket}
                isCurrentChatOnline={onlineUsers.includes(currentChat._id)}
            />
        );
    };

    if (!currentUser) return <Loader />;

    return <div className="homeContainer__wrapper">
        <div className="homeContainer">
            <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={handleChatChange}
                onlineUsers={onlineUsers}
                socket={socket}
            />
            {renderChatBody()}
        </div>
    </div>;
};

export default Home;