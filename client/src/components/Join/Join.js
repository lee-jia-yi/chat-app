import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './Join.css'

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join a Chatroom</h1>
                <form type="submit">
                    <div>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="joinInput"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter the Room Name"
                            className="joinInput mt-20"
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </div>

                    <Link
                        onClick={(e) => (!name || !room) ? e.preventDefault() : null}
                        to={`/chat?name=${name}&room=${room}`}
                    >
                        <button className="button mt-20" type="submit">Enter</button>
                    </Link>

                </form>

            </div>
        </div>

    )
}

export default Join