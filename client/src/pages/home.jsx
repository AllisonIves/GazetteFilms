import React, { useEffect, useState } from 'react';

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
    <div className="homePage">
      <h1 id="welcomeHeader">Welcome to GazetteFilms</h1>
      <p id="introPara">Please navigate to My Films to find your full movie list!</p>
      <hr></hr>
      <h4>My top rated film:</h4>
      <div id="topFilm">
        {highestRatedFilm ? (
          <div className="movie-details">
            <p className="movie-name">Name: {highestRatedFilm.name}</p>
            <p className="movie-stars">Rating: {highestRatedFilm.stars} stars</p>
          </div>
        ) : (
          <p className="movie-stars">Start curating your list today to see your top film here.</p>
        )}
      </div>
      </div>
  );
}

export default Home;