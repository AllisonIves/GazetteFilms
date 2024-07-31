import React, { useEffect, useState } from 'react';
import '../css/styles.css';
import logo from '../images/FILMSLOGO.png'

const Home = () => {
  const [films, setFilms] = useState([]);
  const [highestRatedFilm, setHighestRatedFilm] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch(`${apiUrl}/films/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Can't find your films");
        }
  
        const result = await response.json();
        setFilms(result);
  
        if (result.length > 0) {
          const highestRated = result.reduce((max, film) => 
            (film.stars > max.stars ? film : max), result[0]);
          setHighestRatedFilm(highestRated);
        } else {
          setHighestRatedFilm(null);
        }
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };
  
    fetchFilms();
  }, [apiUrl, token]);

  return (
    <div className="homepage">
      <h1 id="welcomeHeader">Welcome to Gazette Films</h1>
      <p id="introPara">Curate a list of films you've loved -- or hated, or mostly forgot you'd even seen. Keep your ratings up to date and climb our leaderboard by rating more films.</p>
      <hr></hr>
      <h4>My top rated film:</h4>
      <div id="topFilm">
        {highestRatedFilm ? (
          <div className="film-details">
            <p className="film-name">{highestRatedFilm.name}</p>
            <p className="film-stars">Rating: {highestRatedFilm.stars} stars</p>
          </div>
        ) : (
          <p id="curate-message">Start curating your list today to see your top film here.</p>
        )}
      </div>
      <hr></hr>
      <p id="full-list-nav-message">To find your full film list, navigate to my films.</p>
      </div>
  );
}

export default Home;