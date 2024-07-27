import React, { useEffect, useState } from 'react';
import './Auth.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null); // Add state for error handling


//declare consts for apiUrl from dot env and token from local storage
  const apiUrl = import.meta.env.VITE_API_URL || '/';
  // useEffect to get all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error("Can't find any users");
        }

        const result = await response.json();
        setUsers(result);
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };

    fetchUsers();
  }, [apiUrl]);

  return (
    <div className="auth-container">
      {error && <div className="error">{error}</div>} {/* Display error if any */}
      {users.length > 0 ? (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id} className="movie-item">
              <div className="movie-details">
                <span className="movie-name">{user.username}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-films">No users found</div>
      )}
    </div>
  );
};
export default UserList;
