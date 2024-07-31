import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar({ user, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/" exact>
        Gazette Films
      </NavLink>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/"
              end
              activeClassName="active"
            >
              Home
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          {user ? (
            <>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/movie-list"
                  activeClassName="active"
                >
                  My Films
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/users"
                  activeClassName="active"
                >
                  Users
                </NavLink>
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
                <NavLink
                  className="nav-link"
                  to="/register"
                  activeClassName="active"
                >
                  Register
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/login"
                  activeClassName="active"
                >
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
export default NavBar;