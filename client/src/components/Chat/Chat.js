import React, { useState, useEffect } from "react";
import queryString from 'query-string'
import io from 'socket.io-client'

import { useLocation } from "react-router-dom";

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input';
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;
const ENDPOINT = 'https://chat-application-e004e706ecfc.herokuapp.com/';

const Chat = () => {
    const location = useLocation();

    // states
    const [name, setName] = useState('')
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])


    useEffect(() => {
        // retrieve from url
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT, { transports: ['websocket'] })

        setName(name);
        setRoom(room);

        // emit event from FE to BE
        socket.emit('join', { name, room }, (err) => {
            if (err) console.error('Failed to add user to room', err);
        });

        // unmounting when leaving the chat
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [location.search])


    useEffect(() => {
        // listen on message emitted from BE
        socket.on('message', (message) => {
            // add new message to existing messages
            setMessages([...messages, message])
        })

        socket.on('roomData', ({ users }) => {
            setUsers(users)
        })
    }, [messages])


    // function for sending messages
    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => {
                setMessage('');
            });
        };
    };

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar users={users} room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat