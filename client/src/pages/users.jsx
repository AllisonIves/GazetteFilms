import React, { useEffect, useState } from 'react';
import '../css/Auth.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);


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

        result.sort((a, b) => b.filmCount - a.filmCount);
        setUsers(result);
      } catch (error) {
        setError(error.message);
        console.error('Fetch error:', error);
      }
    };

    fetchUsers();
  }, [apiUrl]);

  return (
    <div>
    <div className="users-title-card">
      <h1 className="users-title">Leaderboard</h1>
    </div>
    <div className="users-container">
      {error && <div className="error">{error}</div>}
      {users.length > 0 ? (
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={user._id} className="user-item">
              <div className="user-details">
                <span className="user-rank">{index + 1}. </span>
                <div className="user-details-name">
                  <span className="film-name">{user.username}</span>
                  <span className="film-count">Films: {user.filmCount}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-films">No users found</div>
      )}
    </div>
    </div>
  );
};
export default UserList;
