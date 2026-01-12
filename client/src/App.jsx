import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './components/Layout';
import RegisterDetails from './pages/RegisterDetails';
import Todos from './pages/Todos';
import Posts from './pages/Posts';

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
            <Route path="users/:id/todos" element={<Todos />} />
            <Route path="users/:id/posts" element={<Posts />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;