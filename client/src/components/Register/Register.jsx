
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { registerRoute } from "../../utils/APIRoutes";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

import Lottie from "lottie-react";
import animationData from '../../assets/json/chat-robot.json';

import { toastOptions } from "../../constants/toastOptions";
import { defaultOptions } from "../../constants/lottieDefaultOptions";

const Register = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: null,
        email: null,
        password: null,
        confirmPassword: null,
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
        const { username, email, password, confirmPassword } = values;
        if (!username || !email || !password || !confirmPassword) {
            toast.error("All fields are required", toastOptions);
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords did not match", toastOptions);
            return false;
        }
        if (username.length < 3) {
            toast.error("Username should have at least 3 characters", toastOptions);
            return false;
        }
        if (password.length < 8) {
            toast.error("Password should have at least 8 characters", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const { username, email, password } = values;

            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password,
            });

            if (data.status === 200) {
                localStorage.setItem("chat-app-user", JSON.stringify(data.user));
            } else {
                toast.error("Failed to create account", toastOptions);
            }
            navigate("/");
        }
    };

    return <div className="form__container">
        <ToastContainer />
        <form onSubmit={(e) => handleSubmit(e)}>

            <div className="form__left">


                <div className="form__header">
                    <h1>Create Account</h1>
                </div>

                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    onChange={(e) => handleChange(e)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={(e) => handleChange(e)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={(e) => handleChange(e)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    onChange={(e) => handleChange(e)}
                />
                <button type="submit">Create</button>
                <span>
                    Already have an account? <Link to="/login">Login</Link>
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
    </div >;

};

export default Register;