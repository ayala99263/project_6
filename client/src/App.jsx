import './App.css'
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import Layout from './components/Layout/Layout';
import RegisterDetails from './pages/Auth/RegisterDetails';
import Todos from './pages/Todos/Todos';
import Posts from './pages/Posts/Posts';
import Albums from './pages/Albums/Albums';
import AlbumPhotos from './pages/Albums/AlbumPhotos';

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

          <Route path='/login' element={currentUser
            ? <Navigate to="/home" replace /> : <Login setCurrentUser={setCurrentUser} />} />

          <Route path='/register' >
            <Route index element={<Register />} />
            <Route path='details' element={<RegisterDetails setCurrentUser={setCurrentUser} />} />
          </Route>

          <Route element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>

            <Route path="home" element={<Home user={currentUser} />} />
            <Route path="users/:id/todos" element={<Todos />} />
            <Route path="users/:id/posts" element={<Posts currentUser={currentUser} />} />
            <Route path="users/:id/albums" element={<Albums />} />
            <Route path="users/:id/albums/:albumId/photos" element={<AlbumPhotos />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

