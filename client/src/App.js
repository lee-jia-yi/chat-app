import React from "react";
import Register from './components/Register/Register';
import SetAvatar from './components/SetAvatar/SetAvatar';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/setAvatar" element={<SetAvatar />} />
        </Routes>
    </BrowserRouter>
);

export default App;