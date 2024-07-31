import React, { useEffect, useState } from 'react';
import '../css/styles.css';


const MovieList = () => {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [editingFilm, setEditingFilm] = useState(null); // state for editing
  const [showAddContainer, setShowAddContainer] = useState(true); //state for visibility of add-container
  //const form for update film
  const [editForm, setEditForm] = useState({
    name: '',
    released: '',
    genre: '',
    stars: '',
  });
  //const for form for add film
  const [addForm, setAddForm] = useState({
    name: '',
    released: '',
    genre: '',
    stars: '',
  });

//declare consts for apiUrl from dot env and token from local storage
  const apiUrl = import.meta.env.VITE_API_URL || '/';
  const token = localStorage.getItem('token');
//useEffect to get user's films
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

      setFilms(films.map(film => (film._id === id ? { ...film, ...editForm } : film)));
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
    setShowAddContainer(false);
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
    setShowAddContainer(true);
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
      return <div>Error: {error}</div>;
    }
  };

  return (
    <div>
      <div className="films-title-card">
        <h1 className="films-title">My Films</h1>
      </div>
      <div className="film-list-container">
        <div className="film-scrollable">
        {films.length > 0 ? (
          <ul className="film-list">
            {films.map((film) => (
              <li key={film._id} className="film-item">
                <div className="film-details">
                  <span className="film-name">{film.name}</span>
                  <span className="film-year">Year: {film.released}</span>
                  <span className="film-genre">Genre: {film.genre}</span>
                  <span className="film-stars">Rating: {film.stars}</span>
                </div>
                <div className="film-actions">
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
          <div className="edit-container">
            <h4>Edit Film</h4>
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
                <input type="text" name="genre" value={editForm.genre} onChange={handleEditChange} />
                </div>
                <div>
                  <label>Rating (out of 5 stars):</label>
                  <div className="star-rating">
                    <input type="radio" id="edit-5-stars" name="stars" value="5" checked={editForm.stars === '5'} onChange={handleEditChange} />
                    <label htmlFor="edit-5-stars" className="star">&#9733;</label>
                    <input type="radio" id="edit-4-stars" name="stars" value="4" checked={editForm.stars === '4'} onChange={handleEditChange} />
                    <label htmlFor="edit-4-stars" className="star">&#9733;</label>
                    <input type="radio" id="edit-3-stars" name="stars" value="3" checked={editForm.stars === '3'} onChange={handleEditChange} />
                    <label htmlFor="edit-3-stars" className="star">&#9733;</label>
                    <input type="radio" id="edit-2-stars" name="stars" value="2" checked={editForm.stars === '2'} onChange={handleEditChange} />
                    <label htmlFor="edit-2-stars" className="star">&#9733;</label>
                    <input type="radio" id="edit-1-stars" name="stars" value="1" checked={editForm.stars === '1'} onChange={handleEditChange} />
                    <label htmlFor="edit-1-stars" className="star">&#9733;</label>
                  </div>
                </div>
              </div>
              <button type="submit" className="form-btn">Update</button>
            </form>
          </div>
        )}
      {showAddContainer && (
        <div className="add-container">
          <h4 className="form-title">Add Movie</h4>
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
                <input type="text" name="genre" value={addForm.genre} onChange={handleAddChange} />
              </div>
              <div>
                <label>Rating (out of 5 stars):</label>
                <div className="star-rating">
                  <input type="radio" id="5-stars" name="stars" value="5" checked={addForm.stars === '5'} onChange={handleAddChange} />
                  <label htmlFor="5-stars" className="star">&#9733;</label>
                  <input type="radio" id="4-stars" name="stars" value="4" checked={addForm.stars === '4'} onChange={handleAddChange} />
                  <label htmlFor="4-stars" className="star">&#9733;</label>
                  <input type="radio" id="3-stars" name="stars" value="3" checked={addForm.stars === '3'} onChange={handleAddChange} />
                  <label htmlFor="3-stars" className="star">&#9733;</label>
                  <input type="radio" id="2-stars" name="stars" value="2" checked={addForm.stars === '2'} onChange={handleAddChange} />
                  <label htmlFor="2-stars" className="star">&#9733;</label>
                  <input type="radio" id="1-stars" name="stars" value="1" checked={addForm.stars === '1'} onChange={handleAddChange} />
                  <label htmlFor="1-stars" className="star">&#9733;</label>
                </div>
              </div>
            </div>
            <button type="submit" className="form-btn">Add</button>
          </form>
        </div>)}
      </div>
    </div>
  );
};

export default MovieList;
