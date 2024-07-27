import React, { useEffect, useState } from 'react';
import './MovieList.css';

const MovieList = () => {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [editingFilm, setEditingFilm] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    released: '',
    genre: '',
    stars: '',
  });
  const [addForm, setAddForm] = useState({
    name: '',
    released: '',
    genre: '',
    stars: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL || '/';
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
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };

    fetchFilms();
  }, [apiUrl, token]);

  const deleteFilm = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/films/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Delete movie failed');
      }

      setFilms(films.filter(film => film._id !== id));
    } catch (error) {
      setError(error.message);
      console.error('Delete error:', error);
    }
  };

  const updateFilm = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/films/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Update movie failed');
      }

      const updatedFilm = await response.json();
      setFilms(films.map(film => film._id === id ? { ...film, ...editForm } : film));
      setEditingFilm(null);
    } catch (error) {
      setError(error.message);
      console.error('Update error:', error);
    }
  };

  const handleEditClick = (film) => {
    setEditingFilm(film);
    setEditForm({
      name: film.name || '',
      released: film.released || '',
      genre: film.genre || '',
      stars: film.stars || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingFilm) {
      updateFilm(editingFilm._id);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm({ ...addForm, [name]: value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    const filmData = { ...addForm, user: username };

    try {
      const response = await fetch(`${apiUrl}/films/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(filmData),
      });

      if (!response.ok) {
        throw new Error('Add movie failed');
      }

      const newFilm = await response.json();
      setFilms([...films, newFilm]);
      setAddForm({
        name: '',
        released: '',
        genre: '',
        stars: '',
      });
    } catch (error) {
      setError(error.message);
      console.error('Add error:', error);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="App">
      <div className="container">
        <div className="title-card">
          <h1 className="title">My Films</h1>
        </div>
        <div className="container">
          {films.length > 0 ? (
            <ul className="movie-list">
              {films.map((film) => (
                <li key={film._id} className="movie-item">
                  <div className="movie-details">
                    <span className="movie-name">{film.name}</span>
                    <span className="movie-year">Year: {film.released}</span>
                    <span className="movie-genre">Genre: {film.genre}</span>
                    <span className="movie-stars">Rating: {film.stars}</span>
                  </div>
                  <div className="movie-actions">
                    <button onClick={() => deleteFilm(film._id)} className="btn delete-btn">Delete</button>
                    <button onClick={() => handleEditClick(film)} className="btn edit-btn">Edit</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-films">No films found</div>
          )}
        </div>

        {editingFilm && (
          <div className="form-container">
            <h2>Edit Film</h2>
            <form onSubmit={handleEditSubmit} className="film-form">
              <div className="form-row">
                <div>
                  <label>Name:</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} />
                </div>
                <div>
                  <label>Year Released:</label>
                  <input type="text" name="released" value={editForm.released} onChange={handleEditChange} />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label>Genre:</label>
                  <select name="genre" value={editForm.genre} onChange={handleEditChange}>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Documentary">Documentary</option>
                  </select>
                </div>
                <div>
                  <label>Rating (out of 5 stars):</label>
                  <div className="star-rating">
                    {[5, 4, 3, 2, 1].map(value => (
                      <React.Fragment key={value}>
                        <input type="radio" id={`edit-${value}-stars`} name="stars" value={value} checked={editForm.stars === value} onChange={handleEditChange} />
                        <label htmlFor={`edit-${value}-stars`} className="star">&#9733;</label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn">Update</button>
            </form>
          </div>
        )}

        <div className="form-container">
          <h2>Add Movie</h2>
          <form onSubmit={handleAddSubmit} className="film-form">
            <div className="form-row">
              <div>
                <label>Title:</label>
                <input type="text" name="name" value={addForm.name} onChange={handleAddChange} />
              </div>
              <div>
                <label>Year Released:</label>
                <input type="text" name="released" value={addForm.released} onChange={handleAddChange} />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Genre:</label>
                <select name="genre" value={addForm.genre} onChange={handleAddChange}>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Documentary">Documentary</option>
                </select>
              </div>
              <div>
                <label>Rating (out of 5 stars):</label>
                <div className="star-rating">
                  {[5, 4, 3, 2, 1].map(value => (
                    <React.Fragment key={value}>
                      <input type="radio" id={`add-${value}-stars`} name="stars" value={value} checked={addForm.stars === value} onChange={handleAddChange} />
                      <label htmlFor={`add-${value}-stars`} className="star">&#9733;</label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className="btn">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieList;