
import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AddPassenger from './Pages/AddPassenger';
import Dashboard from './Pages/Dashboard';
import Ticket from "./Pages/Ticket";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-passenger" element={<AddPassenger />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ticket" element={<Ticket />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
