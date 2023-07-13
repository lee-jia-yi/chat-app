import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';

import './ChatContainer.css';
import ChatInfoBar from "./components/ChatInfoBar/ChatInfoBar";
import ChatInput from "./components/ChatInput/ChatInput";
import { getMessagesRoute, sendMessageRoute } from "../../../../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import ChatMessages from "./components/ChatMessages/ChatMessages";


import { toastOptions } from "../../../../constants/toastOptions";


const ChatContainer = ({ currentChat, setCurrentChat, currentUser, socket, isCurrentChatOnline }) => {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [arrivalMsg, setArrivalMsg] = useState(null);

    useEffect(() => {
        async function getAllMessages() {
            if (currentChat) {
                const res = await axios.post(getMessagesRoute, {
                    from: currentUser._id,
                    to: currentChat._id
                });
                if (res.status !== 200) return toast.error("Failed to fetch messages", toastOptions);

                setMessages(res.data);
            }
        };
        getAllMessages();
    }, [currentChat]);

    const handleSendMessage = async () => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: message
        });

        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: message,
            createdDate: moment(Date.now()).format("YYYY-MM-DD"),
            createdTime: moment(Date.now()).format("h:mma")
        });

        const msgs = [...messages];
        msgs.push({
            fromSelf: true,
            message: message,
            createdDate: moment(Date.now()).format("YYYY-MM-DD"),
            createdTime: moment(Date.now()).format("h:mma")
        });
        setMessages(msgs);
        setMessage('');
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("receive-msg", (message) => {
                setArrivalMsg({
                    fromSelf: false,
                    message: message.message,
                    createdDate: message.createdDate,
                    createdTime: message.createdTime
                });
            });
        }
    }, []);

    useEffect(() => {
        arrivalMsg && setMessages((prev) => [...prev, arrivalMsg]);
    }, [arrivalMsg]);

    return (
        <>
            <div className="chatContainer">
                <ChatInfoBar
                    currentChat={currentChat}
                    setCurrentChat={setCurrentChat}
                    isCurrentChatOnline={isCurrentChatOnline}
                    socket={socket}
                />
                <ChatMessages
                    messages={messages}
                />
                <ChatInput
                    message={message}
                    setMessage={setMessage}
                    sendMessage={handleSendMessage}
                    currentChat={currentChat}
                />
            </div >
            <ToastContainer />
        </>
    );
};

export default ChatContainer;