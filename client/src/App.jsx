import './App.css'
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Layout from './components/Layout';
import RegisterDetails from './components/RegisterDetails';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            localStorage.getItem("currentUser") ?
              <Navigate to="/home" replace /> :
              <Navigate to="/login" replace />
          } />
          <Route path='/login' element={<Login />} />
          <Route path='/register' >
            <Route index element={<Register />} />
            <Route path='details' element={<RegisterDetails />} />
          </Route>

          <Route element={<Layout />}>

            <Route path="home" element={<Home />} />
            {/* <Route path="users/:id/todos" element={<Todos />} />
            <Route path="users/:id/posts" element={<Posts />} /> */}

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;