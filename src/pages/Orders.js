import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService, bookService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { addToCart } = useCart();

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
            setOrders(userOrders.sort((a, b) => new Date(b.createdAt || b.orderTimestamp || b.orderDate) - new Date(a.createdAt || a.orderTimestamp || a.orderDate)));
            return;
          }
        }

        setOrders(enrichedOrders.sort((a, b) => new Date(b.createdAt || b.orderTimestamp || b.orderDate) - new Date(a.createdAt || a.orderTimestamp || a.orderDate)));
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
        setOrders(userOrders.sort((a, b) => new Date(b.createdAt || b.orderTimestamp || b.orderDate) - new Date(a.createdAt || a.orderTimestamp || a.orderDate)));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return '🕒';
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

  // Action handlers
  const handleLeaveReview = (order) => {
    // Navigate to first book's page to leave a review if possible
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
    const bookId = firstItem?.book?.bookId || firstItem?.bookId;
    if (bookId) {
      navigate(`/books/${bookId}`);
    } else {
      window.alert('No book found to review in this order.');
    }
  };

  const handleCancelOrder = async (order) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      // Attempt to update order status on backend; if not available, update locally
      // Prefer dedicated cancel endpoint if available
      try {
        // try orderService.cancel if implemented
        if (orderService.cancel) {
          await orderService.cancel(order.orderId);
        } else {
          // fallback: direct API call
          const api = (await import('../services/api')).default;
          await api.put(`/orders/cancel/${order.orderId}`);
        }
        window.alert('Order cancelled successfully.');
      } catch (err) {
        console.warn('Backend cancel failed, updating locally', err);
        // local fallback: store in localStorage
        const stored = JSON.parse(localStorage.getItem('snuggleReadOrders') || '[]');
        const updatedStored = stored.map(o => o.orderId === order.orderId ? { ...o, status: 'cancelled' } : o);
        localStorage.setItem('snuggleReadOrders', JSON.stringify(updatedStored));
        window.alert('Order cancelled locally (offline).');
      }
      fetchOrders();
    } catch (error) {
      console.error('Unable to cancel order', error);
      window.alert('Unable to cancel order at this time.');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) {
      window.alert('No items to reorder.');
      return;
    }
    // Add each item back to cart (best-effort mapping)
    for (const it of order.items) {
      const bookId = it.book?.bookId || it.bookId;
      const bookObj = {
        bookId,
        title: it.title || it.book?.title || 'Unknown',
        author: it.author || it.book?.author || 'Unknown',
        price: it.price || it.book?.price || 0,
      };
      addToCart(bookObj, it.quantity || 1);
    }
    window.alert('Items added to cart.');
    navigate('/cart');
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
                    📅 Placed on {formatDate(order.createdAt)}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#95a5a6' }}>
                    ⏱️ Order ID: {order.createdAt || order.orderId} • 📦 {order.totalQuantity || order.items.reduce((sum, item) => sum + item.quantity, 0)} items
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
                  <button className="btn btn-secondary btn-small" onClick={() => handleLeaveReview(order)}>
                    📋 Leave Review
                  </button>
                )}
                {(order.status === 'confirmed' || order.status === 'processing') && (
                  <button className="btn btn-warning btn-small" onClick={() => handleCancelOrder(order)}>
                    ❌ Cancel Order
                  </button>
                )}
                <button className="btn btn-secondary btn-small" onClick={() => handleViewDetails(order)}>
                  📄 View Details
                </button>
                <button className="btn btn-secondary btn-small" onClick={() => handleReorder(order)}>
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
      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <h3>Order #{selectedOrder.orderId} Details</h3>
            <p>Placed: {formatDate(selectedOrder.createdAt)}</p>
            <div>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <div>
                    <strong>{it.title}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>{it.author}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>Qty: {it.quantity}</div>
                    <div>R{(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;