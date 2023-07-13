import React, { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import './SetAvatar.css';
import { setAvatarRoute } from "../../utils/APIRoutes";
import Loader from "../Loader/Loader";
import { toastOptions } from "../../constants/toastOptions";

const AVATAR_ENDPOINT = "https://api.multiavatar.com/45678945";
const API_KEY = `O5UTrSjf87Myl9`;

const SetAvatar = () => {

    const navigate = useNavigate();

    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/");
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchAvatars() {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(
                    `${AVATAR_ENDPOINT}/${Math.round(Math.random() * 1000)}?apikey=${API_KEY}`
                );

                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        };
        fetchAvatars();
    }, []);


    const setProfilePic = async () => {
        if (selectedAvatar === null) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar]
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user", JSON.stringify(user));
                navigate('/');
            }
        }
    };

    if (isLoading) return <Loader />;

    return (
        <>
            <div className="avatar__container">
                <div className="title__container">
                    <h1>Select an Avatar for your profile picture</h1></div>
                <div className="avatars">
                    {
                        avatars.map((avatar, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className={`avatar ${selectedAvatar === idx ? "selected" : ""}`}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        onClick={() => setSelectedAvatar(idx)}
                                    />

                                </div>
                            );
                        })
                    }
                </div>
                <button className="submit-btn" onClick={() => setProfilePic()}>Set as Profile Pic</button>
            </div >
            <ToastContainer />
        </>
    );


};

export default SetAvatar;