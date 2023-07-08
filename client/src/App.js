import React from "react";
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'

import { Route, Routes } from 'react-router-dom';

const App = () => (
 <Routes>
  <Route path="/" element={<Join />} />
  <Route path="/chat" element={<Chat />} />
 </Routes>
)

export default App;