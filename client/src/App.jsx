import React, { useState } from 'react';
import './App.css';
import { Navigate, Routes, Route } from 'react-router-dom';
import Login from "./components/Login"
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import ResetPassword from './components/ResetPassword';
import Homepage from './components/Homepage';

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={localStorage.user? <Navigate to="/home"/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyemail" element={<VerifyEmail/>} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
        <Route path="/home" element={<Homepage/>} />
        <Route path="/" element={<Homepage/>} />
      </Routes>
    </>
  );
}

export default App;


