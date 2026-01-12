import './App.css'
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './components/Layout';
import RegisterDetails from './pages/RegisterDetails';
import Todos from './pages/Todos';
import Posts from './pages/Posts';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            currentUser ?
              <Navigate to="/home" replace /> :
              <Navigate to="/login" replace />
          } />

          <Route path='/login' element={<Login setCurrentUser={setCurrentUser} />} />

          <Route path='/register' >
            <Route index element={<Register />} />
            <Route path='details' element={<RegisterDetails setCurrentUser={setCurrentUser}/>} />
          </Route>

          <Route element={<Layout setCurrentUser={setCurrentUser}/>}>

            <Route path="home" element={<Home />} />
            <Route path="users/:id/todos" element={<Todos />} />
            <Route path="users/:id/posts" element={<Posts currentUser={currentUser} />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

