import React, { useEffect, useState } from 'react';
import './home.css'; // Add CSS Files to Apply Style

const Home = () => {
    const [films, setFilms] = useState([]);
    const [highestRatedFilm, setHighestRatedFilm] = useState(null);
    const [error, setError] = useState('');
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
        <div className="home-container">
            <h1>Welcome to GazetteFilms</h1>
            <p>Please navigate to My Films to find your full movie list!</p>
            <hr />
            <h4>My top rated film:</h4>
            <div>
                {highestRatedFilm ? (
                    <div>
                        <p>Name: {highestRatedFilm.name}</p>
                        <p>Rating: {highestRatedFilm.stars}</p>
                    </div>
                ) : (
                    <p>No films available...</p>
                )}
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Home;