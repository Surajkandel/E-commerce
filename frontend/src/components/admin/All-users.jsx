import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/all-users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Ensure response data is an array
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (res.data && Array.isArray(res.data.users)) {
          // If data is nested in a users property
          setUsers(res.data.users);
        } else {
          // Handle unexpected response format
          setUsers([]);
          setError('Unexpected data format received from server');
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.patch(
        `/api/admin/approve-seller/${userId}`, 
        {}, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'approved' } : user
      ));
    } catch (err) {
      console.error('Approval failed:', err);
      setError('Approval failed. Please try again.');
    }
  };

  return (
    <div className="admin-container">
      <h1>All Users</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td style={{ color: user.status === 'approved' ? 'green' : 'orange' }}>
                    {user.status}
                  </td>
                  <td>
                    {user.role === 'seller' && (
                      <button 
                        onClick={() => handleApprove(user._id)} 
                        disabled={user.status === 'approved'}
                        className="approve-button"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .admin-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .error-message {
          color: red;
          margin-bottom: 15px;
        }
        
        .users-table {
          margin-top: 20px;
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        
        tr:hover {
          background-color: #f5f5f5;
        }
        
        .approve-button {
          padding: 6px 12px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .approve-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .approve-button:not(:disabled):hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default AllUsers;