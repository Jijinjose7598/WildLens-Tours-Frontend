import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://wildlens-tours-backend-q5lv.onrender.com/api/users');
        setUsers(response.data.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError(error.response || error.message); // Set error message if request fails
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching users: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>All Users</h2>
      {user && (user.isAdmin || user.isSuperAdmin) ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin
                    ? 'Admin'
                    : user.isSuperAdmin
                    ? 'Super Admin'
                    : 'User'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You do not have permission to view this page.</p>
      )}
    </div>
  );
};

export default UserList;
