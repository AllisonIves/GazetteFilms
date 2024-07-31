import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../images/FILMSLOGO.png'

function NavBar({ user, handleLogout }) {
  return (
    <div className="navDiv">
    <nav className="navbar navbar-expand-lg bg-light navbar-light fixed-top">
      <NavLink className="navbar-brand" to="/" exact>
      <img id="films-logo" src={logo}></img>
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
                  Leaderboard
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
    </div>
  );
}
export default NavBar;