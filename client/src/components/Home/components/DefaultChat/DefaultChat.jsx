import React from "react";
import Lottie from "lottie-react";
import animationData from '../../../../assets/json/chat-robot.json';

import './DefaultChat.css';
import { defaultOptions } from "../../../../constants/lottieDefaultOptions";

const DefaultChat = () => {

    return (
        <div className="defaultChat">
            <Lottie
                className="lottie-animation"
                animationData={animationData}
                options={defaultOptions}
            />
            <p>
                Select a chat to start messaging!
            </p>
        </div>
    );
};

export default DefaultChat;