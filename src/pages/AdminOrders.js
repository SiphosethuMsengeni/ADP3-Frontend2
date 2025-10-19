import React, { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return '#95a5a6';
      case 'confirmed':
        return '#3498db';
      case 'processing':
        return '#f39c12';
      case 'shipped':
        return '#9b59b6';
      case 'delivered':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  useEffect(() => {
    if (!isAdmin()) return;
    fetchOrders();
  }, [isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderService.getAll();
      setOrders(res.data || []);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update order status: ' + err.message);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderService.delete(orderId);
      fetchOrders();
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  if (!isAdmin()) return <div>Access denied.</div>;

  return (
    <div className="container">
      <h2>Manage Orders</h2>
      {loading && <div>Loading orders...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table className="orders-table" style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.user?.userId || 'N/A'}</td>
              <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
              <td>
                <select 
                  value={order.status?.toLowerCase() || 'pending'} 
                  onChange={e => handleStatusChange(order.orderId, e.target.value)}
                  style={{ 
                    backgroundColor: getStatusColor(order.status), 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    borderRadius: '4px' 
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>R{order.totalAmount?.toFixed(2) || '0.00'}</td>
              <td>
                <button className="btn btn-danger btn-small" onClick={() => handleDelete(order.orderId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && !loading && <div>No orders found.</div>}
    </div>
  );
};

export default AdminOrders;
