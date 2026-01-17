import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import Layout from './components/Layout/Layout';
import RegisterDetails from './pages/Auth/RegisterDetails';
import Todos from './pages/Todos/Todos';
import Posts from './pages/Posts/Posts';
import Albums from './pages/Albums/Albums';
import AlbumPhotos from './pages/Albums/AlbumPhotos';
import OwnerGuard from './components/OwnerGuard/OwnerGuard';

export default function App() {
  const { currentUser } = useUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          currentUser ?
            <Navigate to="/home" replace /> :
            <Navigate to="/login" replace />
        } />

        <Route path='/login' element={
          currentUser ? <Navigate to="/home" replace /> : <Login />
        } />

        <Route path='/register' >
          <Route index element={<Register />} />
          <Route path='details' element={<RegisterDetails />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route element={<OwnerGuard />}>
            <Route path="users/:id/todos" element={<Todos />} />
            <Route path="users/:id/posts" element={<Posts />} />
            <Route path="users/:id/albums" element={<Albums />} />
            <Route path="users/:id/albums/:albumId/photos" element={<AlbumPhotos />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}