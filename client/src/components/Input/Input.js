import React from "react";
import './Input.css';

const Input = ({ message, setMessage, sendMessage }) => (
    <div className="inputContainer">
        <form className="form">
            <input
                type="text"
                className="input type_msg"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? sendMessage(e) : null}
            />
            <button disabled={message.length === 0} className="sendButton send_btn" onClick={(e) => sendMessage(e)}>Send</button>
        </form>
    </div>

);

export default Input;