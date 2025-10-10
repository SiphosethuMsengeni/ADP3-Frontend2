import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService, bookService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Try fetching from backend first
      try {
        const res = await orderService.getByUserId(user.userId);
        const serverOrders = res.data || [];

        // Normalize server orders and enrich items with availability by fetching current book stock (best-effort)
        const enrichedOrders = [];
        for (const ord of serverOrders) {
          if (!ord) continue;
          // normalize total field used by UI
          const total = ord.total || ord.totalAmount || 0;
          const items = ord.items || [];
          const totalQuantity = ord.totalQuantity || items.reduce((s, it) => s + (it.quantity || 0), 0);

          for (const item of items) {
            try {
              const bookRes = await bookService.getById(item.book.bookId);
              const book = bookRes.data;
              item.available = book ? (book.quantity >= item.quantity) : false;
            } catch (e) {
              item.available = true; // if we can't fetch, assume available
            }
          }

          enrichedOrders.push({ ...ord, total, totalQuantity, items });
        }

        // If server returned no orders, try to show orders stored in localStorage (from previous fallback)
        if (enrichedOrders.length === 0) {
          const storedOrders = JSON.parse(localStorage.getItem('snuggleReadOrders') || '[]');
          const userOrders = storedOrders.filter(o => o.userId === user?.userId);
          if (userOrders.length > 0) {
            setOrders(userOrders.sort((a, b) => new Date(b.orderTimestamp || b.orderDate) - new Date(a.orderTimestamp || a.orderDate)));
            return;
          }
        }

        setOrders(enrichedOrders.sort((a, b) => new Date(b.orderTimestamp || b.orderDate) - new Date(a.orderTimestamp || a.orderDate)));
        return;
      } catch (err) {
        console.warn('Unable to fetch orders from backend, falling back to localStorage', err);
      }

      // Fallback to localStorage for demo
      const storedOrders = JSON.parse(localStorage.getItem('snuggleReadOrders') || '[]');
      const userOrders = storedOrders.filter(order => order.userId === user?.userId);

      if (userOrders.length === 0 && user) {
        setOrders([]);
      } else {
        setOrders(userOrders.sort((a, b) => new Date(b.orderTimestamp || b.orderDate) - new Date(a.orderTimestamp || a.orderDate)));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '📦';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated()) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="container">
      <h2>📦 My Orders</h2>
      <p>Track and manage your book orders from Snuggle Read</p>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <button className="btn" onClick={() => navigate('/books')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {orders.map(order => (
            <div key={order.orderId} className="card" style={{ marginBottom: '1.5rem' }}>
              {/* Order Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid #eee'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>
                    Order #{order.orderId}
                  </h3>
                  <p style={{ margin: 0, color: '#7f8c8d' }}>
                    📅 Placed on {formatDate(order.orderDate)}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#95a5a6' }}>
                    ⏱️ Order ID: {order.orderTimestamp || order.orderId} • 📦 {order.totalQuantity || order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div 
                    style={{ 
                      background: getStatusColor(order.status),
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      display: 'inline-block'
                    }}
                  >
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>
                    R{order.total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 style={{ marginBottom: '1rem' }}>Items ({order.items.length})</h4>
                {order.items.map((item, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '1rem',
                      padding: '1rem',
                      background: '#f8f9fa',
                      borderRadius: '10px',
                      gap: '1rem'
                    }}
                  >
                    <div className="book-image" style={{ 
                      width: '60px', 
                      height: '60px', 
                      fontSize: '0.8rem',
                      minWidth: '60px'
                    }}>
                      📚
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: '0 0 0.25rem 0' }}>{item.title}</h5>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#7f8c8d' }}>
                        by {item.author}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#27ae60' }}>
                        R{item.price.toFixed(2)}
                      </div>
                      {item.quantity > 1 && (
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                          Total: R{(item.price * item.quantity).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #eee'
              }}>
                {order.status === 'delivered' && (
                  <button className="btn btn-secondary btn-small">
                    📋 Leave Review
                  </button>
                )}
                {(order.status === 'confirmed' || order.status === 'processing') && (
                  <button className="btn btn-warning btn-small">
                    ❌ Cancel Order
                  </button>
                )}
                <button className="btn btn-secondary btn-small">
                  📄 View Details
                </button>
                <button className="btn btn-secondary btn-small">
                  🔄 Reorder Items
                </button>
              </div>

              {/* Delivery Info */}
              {order.status === 'shipped' && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                  borderRadius: '10px'
                }}>
                  <h5 style={{ margin: '0 0 0.5rem 0' }}>🚚 Delivery Information</h5>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Tracking Number:</strong> SN{order.orderId}-TRK
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Expected Delivery:</strong> 2-3 business days
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Order Summary Stats */}
          <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)' }}>
            <h3>📊 Your Order Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2a5298' }}>
                  {orders.length}
                </div>
                <div>Total Orders</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
                  R{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </div>
                <div>Total Spent</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
                  {orders.reduce((sum, order) => sum + order.items.length, 0)}
                </div>
                <div>Books Purchased</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9b59b6' }}>
                  {orders.filter(order => order.status === 'delivered').length}
                </div>
                <div>Completed Orders</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;