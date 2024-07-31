import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import MovieList from './pages/myFilms';
import UserList from './pages/users';
import NavBar from './components/NavBar';
import logo from './images/logo.png'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token && username ? { token, username } : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ token, username });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    window.location.href = '/'; //redirect to home page upon logout
  };


  return (
    <Router>
      <div className="App">
        <NavBar user={user} handleLogout={handleLogout} />
        <div className="mainNav">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/movie-list" element={<MovieList />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </div>
        <div className="footer">
          <nav className="navbar navbar-fixed-bottom">
            <div className="inner-footer">
              <img id="logo" src={logo}></img>
            </div>
            <div className="contact">
            <span className="navbar-text mx-auto">
            &copy; 2024 Gazette Computing Co.
              </span>
              <a href="https://github.com/AllisonIves/GazetteFilms/">
              <span className="navbar-text mx-auto">
                View on Github
              </span>
              </a>
            </div>
            </nav>
            </div>
      </div>
    </Router>
  );
}

export default App;