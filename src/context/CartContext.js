import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('snuggleReadCart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing stored cart:', error);
        localStorage.removeItem('snuggleReadCart');
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('snuggleReadCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.bookId === book.bookId);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.bookId === book.bookId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...book, quantity }];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item.bookId !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.bookId === bookId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getStudentDiscount = () => {
    return cartItems.reduce((total, item) => total + (item.price * 0.05 * item.quantity), 0);
  };

  const getDiscountedTotal = (userType = 'customer') => {
    const subtotal = getCartSubtotal();
    const discount = userType === 'customer' ? getStudentDiscount() : 0;
    return subtotal - discount;
  };

  const getShippingCost = (userType = 'customer') => {
    const discountedTotal = getDiscountedTotal(userType);
    return discountedTotal >= 500 ? 0 : 50;
  };

  const getFinalTotal = (userType = 'customer') => {
    return getDiscountedTotal(userType) + getShippingCost(userType);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getStudentDiscount,
    getDiscountedTotal,
    getShippingCost,
    getFinalTotal,
    getCartItemCount,
    getTotalQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};