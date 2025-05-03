import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Tracks which action is loading

  const fetchPendingSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/admin/pending-sellers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Handle different response formats
      const sellersData = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.sellers || []);
      
      setSellers(sellersData);
    } catch (err) {
      console.error('Failed to fetch sellers:', err);
      setError(err.response?.data?.msg || 'Failed to load pending sellers');
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(`${action}-${id}`); // e.g. "approve-123"
      const url = `/api/admin/${action}-seller/${id}`;
      await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchPendingSellers(); // Refresh list after action
    } catch (err) {
      console.error('Action failed:', err);
      setError(err.response?.data?.msg || `Failed to ${action} seller`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Pending Seller Approvals</h2>
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0', padding: '10px', background: '#ffeeee' }}>
          {error}
        </div>
      )}
      
      {loading ? (
        <p>Loading pending sellers...</p>
      ) : sellers.length === 0 ? (
        <p>No pending sellers found</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>License</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(seller => (
                <tr key={seller._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{seller.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{seller.email}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {seller.sellerLicenseNumber || 'N/A'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button 
                      onClick={() => handleAction(seller._id, 'approve')}
                      disabled={actionLoading === `approve-${seller._id}`}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {actionLoading === `approve-${seller._id}` ? 'Processing...' : '✅ Approve'}
                    </button>
                    <button 
                      onClick={() => handleAction(seller._id, 'reject')}
                      disabled={actionLoading === `reject-${seller._id}`}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {actionLoading === `reject-${seller._id}` ? 'Processing...' : '❌ Reject'}
                    </button>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <pre style={{ 
                      maxWidth: '300px', 
                      overflow: 'auto',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}>
                      {JSON.stringify(seller, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingSellersPage;