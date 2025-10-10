import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartSubtotal,
    getStudentDiscount,
    getDiscountedTotal,
    getShippingCost,
    getFinalTotal,
    getTotalQuantity,
    clearCart 
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Please Login</h2>
          <p>You need to be logged in to view your cart.</p>
          <button className="btn" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Build payload expected by backend
    const payload = {
      shippingAddress: user?.contact?.address || '',
      paymentMethod: 'CARD',
  status: 'Pending',
  orderTimestamp: new Date().toISOString(),
      totalAmount: getFinalTotal(user?.userType),
      items: cartItems.map(ci => ({
        quantity: ci.quantity,
        price: ci.price,
        book: { bookId: ci.bookId }
      }))
    };

    // Try to create order on backend; fallback to localStorage if backend unavailable
    (async () => {
      try {
        await orderService.create(payload, user.userId);
        clearCart();
        navigate('/orders');
      } catch (err) {
        console.error('Backend order create failed:', err);
        // If backend signals insufficient stock, show the message and do NOT clear the cart
        const status = err?.response?.status;
        const data = err?.response?.data;
        if (status === 409) {
          // Backend returns a human-friendly message like "Insufficient stock for book: <title>"
          alert(`Order failed: ${data || 'Some items are unavailable in the requested quantities.'}`);
          return;
        }

        // For any other error, fallback to localStorage behavior so user doesn't lose the order
        console.warn('Falling back to localStorage order storage due to error.');
        const existingOrders = JSON.parse(localStorage.getItem('snuggleReadOrders') || '[]');
        const newOrder = {
          orderId: Date.now().toString(),
          userId: user.userId,
          userEmail: user.userEmail,
          items: cartItems,
          subtotal: getCartSubtotal(),
          discount: user?.userType === 'customer' ? getStudentDiscount() : 0,
          shipping: getShippingCost(user?.userType),
          total: getFinalTotal(user?.userType),
          totalQuantity: getTotalQuantity(),
          orderTimestamp: new Date().toISOString(),
          status: 'confirmed'
        };
        existingOrders.push(newOrder);
        localStorage.setItem('snuggleReadOrders', JSON.stringify(existingOrders));
        clearCart();
        navigate('/orders');
      }
    })();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>🛒 Your Cart is Empty</h2>
          <p>Start shopping to add books to your cart!</p>
          <button className="btn" onClick={() => navigate('/books')}>
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>🛒 Your Shopping Cart</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Cart Items */}
        <div className="card">
          <h3>Cart Items ({cartItems.length})</h3>
          
          {cartItems.map(item => (
            <div key={item.bookId} className="cart-item">
              <div className="book-image" style={{ 
                width: '80px', 
                height: '80px', 
                minWidth: '80px',
                fontSize: '0.8rem' 
              }}>
                📚
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  {item.title}
                </h4>
                <p style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}>
                  by {item.author}
                </p>
                <div className="book-genre" style={{ marginBottom: '0.5rem' }}>
                  {item.genre}
                </div>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>
                  R{item.price?.toFixed(2)}
                </p>
              </div>

              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span style={{ 
                  padding: '0 1rem', 
                  fontWeight: 'bold',
                  minWidth: '3rem',
                  textAlign: 'center',
                  display: 'inline-block'
                }}>
                  {item.quantity}
                </span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                  disabled={item.quantity >= item.maxQuantity || item.quantity >= 10}
                >
                  +
                </button>
              </div>

              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  R{(item.price * item.quantity).toFixed(2)}
                </p>
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => removeFromCart(item.bookId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
            <button 
              className="btn btn-secondary"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <button 
              className="btn"
              onClick={() => navigate('/books')}
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3>Order Summary</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.bookId} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                <span>{item.title.substring(0, 20)}... (×{item.quantity})</span>
                <span>R{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr />
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal ({getTotalQuantity()} items):</span>
              <span>R{getCartSubtotal().toFixed(2)}</span>
            </div>
            {user?.userType === 'customer' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#27ae60' }}>
                <span>Student Discount (5%):</span>
                <span>-R{getStudentDiscount().toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Shipping:</span>
              <span style={{ color: getShippingCost(user?.userType) === 0 ? '#27ae60' : '#333' }}>
                {getShippingCost(user?.userType) === 0 ? 'FREE' : `R${getShippingCost(user?.userType).toFixed(2)}`}
              </span>
            </div>
          </div>

          <hr />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            <span>Total:</span>
            <span style={{ color: '#27ae60' }}>
              R{getFinalTotal(user?.userType).toFixed(2)}
            </span>
          </div>

          <button 
            className="btn btn-success"
            style={{ width: '100%', marginBottom: '1rem' }}
            onClick={handleCheckout}
          >
            🎓 Checkout as Student
          </button>

          <div style={{ fontSize: '0.8rem', color: '#7f8c8d', textAlign: 'center' }}>
            <p>✅ Secure payment processing</p>
            <p>📚 Digital receipts available</p>
            <p>🚚 Free shipping on orders over R500</p>
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)' }}>
        <h3>🎓 Student Benefits</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>✨ 5% Student Discount</strong>
            <p>Automatically applied to all orders</p>
          </div>
          <div>
            <strong>🚚 Free Shipping</strong>
            <p>On orders over R500</p>
          </div>
          <div>
            <strong>📱 Digital Access</strong>
            <p>E-book versions available for select titles</p>
          </div>
          <div>
            <strong>🔄 Easy Returns</strong>
            <p>30-day return policy for unopened books</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;