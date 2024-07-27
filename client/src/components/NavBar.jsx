import React from 'react';
import { Link } from 'react-router-dom';
import 'client/src/pages/MovieList.css';

function NavBar({ user, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Gazette Films</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          {user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/movie-list">My Films</Link>
              </li>
              <li className="nav-item">
                <span className="navbar-text">Welcome, {user.username}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;