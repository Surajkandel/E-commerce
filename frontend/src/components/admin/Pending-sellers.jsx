import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingSellersPage = () => {
  const [sellers, setSellers] = useState([]);

  const fetchPendingSellers = () => {
    axios.get('/api/admin/pending-sellers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setSellers(res.data.sellers))
    .catch(err => console.error(err.response?.data?.msg));
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const url = `/api/admin/${action}-seller/${id}`;
      await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPendingSellers(); // Refresh list after action
    } catch (err) {
      console.error(err.response?.data?.msg);
    }
  };

  return (
    <div>
      <h2>Pending Seller Approvals</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>License</th>
            <th>Actions</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map(s => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.sellerLicenseNumber || 'N/A'}</td>
              <td>
                <button onClick={() => handleAction(s._id, 'approve')}>✅ Approve</button>
                <button onClick={() => handleAction(s._id, 'reject')}>❌ Reject</button>
              </td>
              <td>
                <pre style={{ maxWidth: 300, overflow: 'auto' }}>
                  {JSON.stringify(s, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingSellersPage;
