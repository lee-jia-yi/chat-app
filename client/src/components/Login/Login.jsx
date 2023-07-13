import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { loginRoute } from "../../utils/APIRoutes";

import '../Register/Register.css';

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Lottie from "lottie-react";
import animationData from '../../assets/json/chat-robot.json';

import { toastOptions } from "../../constants/toastOptions";
import { defaultOptions } from "../../constants/lottieDefaultOptions";

const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: null,
        password: null,
    });

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate("/");
        }
    }, []);

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    const handleValidation = () => {
        const { username, password } = values;
        if (!username || !password) {
            toast.error("All fields are required", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {
            const { username, password } = values;

            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });

            if (data.status === 200) {
                localStorage.setItem("chat-app-user", JSON.stringify(data.user));
                navigate("/");
            } else {
                toast.error(`Failed to log in: ${data.msg}`, toastOptions);
            }
        }
    };

    return (
        <>
            <div className="form__container">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="form__left">
                        <div className="form__header">
                            <h1>Log In</h1>
                        </div>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={(e) => handleChange(e)}
                            min={3}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={(e) => handleChange(e)}
                        />
                        <button type="submit">Log In</button>
                        <span>
                            Don't have an account? <Link to="/register">Register</Link>
                        </span>

                    </div>
                    <div className="form__right">
                        <Lottie
                            className="lottie-animation-main"
                            animationData={animationData}
                            options={defaultOptions}
                        />
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;