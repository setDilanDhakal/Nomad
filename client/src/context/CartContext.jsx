import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getStoredValue = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => getStoredValue("nomadCart", []));
  const [orderHistory, setOrderHistory] = useState(() =>
    getStoredValue("nomadOrderHistory", [])
  );

  const persistCart = (items) => {
    setCartItems(items);

    if (typeof window !== "undefined") {
      localStorage.setItem("nomadCart", JSON.stringify(items));
    }
  };

  const persistOrders = (orders) => {
    setOrderHistory(orders);

    if (typeof window !== "undefined") {
      localStorage.setItem("nomadOrderHistory", JSON.stringify(orders));
    }
  };

  const normalizeOrder = useCallback((order) => {
    if (!order) {
      return null;
    }

    return {
      id: order.id || order._id || `NM-${Date.now()}`,
      date: order.date || order.orderedOn || order.createdAt || new Date().toISOString(),
      total: Number(order.total ?? order.totalPrice ?? 0),
      status: order.status || "Placed",
      paymentMethod: order.paymentMethod || "cod",
      items: Array.isArray(order.items) ? order.items : [],
      raw: order,
    };
  }, []);

  const loadMyOrders = useCallback(async () => {
    if (!user || user.isAdmin) {
      persistOrders([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch orders");
      }

      const nextOrders = Array.isArray(result.data)
        ? result.data.map(normalizeOrder).filter(Boolean)
        : [];
      persistOrders(nextOrders);
    } catch {
      // Keep the existing order history if the request fails.
    }
  }, [normalizeOrder, user]);

  useEffect(() => {
    loadMyOrders();
  }, [loadMyOrders]);

  const addToCart = (product) => {
    if (!product?._id) {
      return;
    }

    setCartItems((current) => {
      const existingItem = current.find((item) => item._id === product._id);
      const nextItems = existingItem
        ? current.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...current, { ...product, quantity: 1 }];

      if (typeof window !== "undefined") {
        localStorage.setItem("nomadCart", JSON.stringify(nextItems));
      }

      return nextItems;
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((current) => {
      const nextItems = current.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("nomadCart", JSON.stringify(nextItems));
      }

      return nextItems;
    });
  };

  const decreaseQuantity = (productId) => {
    setCartItems((current) => {
      const nextItems = current
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      if (typeof window !== "undefined") {
        localStorage.setItem("nomadCart", JSON.stringify(nextItems));
      }

      return nextItems;
    });
  };

  const removeFromCart = (productId) => {
    const nextItems = cartItems.filter((item) => item._id !== productId);
    persistCart(nextItems);
  };

  const clearCart = () => {
    persistCart([]);
  };

  const placeOrder = async () => {
    if (!cartItems.length) {
      return null;
    }

    if (!user) {
      throw new Error("Please login first");
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: Number(item.quantity || 1),
        })),
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Failed to place order");
    }

    const newOrder = normalizeOrder(result.data);
    const nextOrders = newOrder ? [newOrder, ...orderHistory] : orderHistory;
    persistOrders(nextOrders);
    clearCart();

    return newOrder;
  };

  const deleteOrder = async (orderId) => {
    if (!user) {
      throw new Error("Please login first");
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete order");
    }

    const nextOrders = orderHistory.filter((order) => String(order.id || order._id) !== String(orderId));
    persistOrders(nextOrders);
    return true;
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const value = useMemo(
    () => ({
      cartItems,
      orderHistory,
      cartCount,
      cartSubtotal,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      deleteOrder,
    }),
    [cartItems, orderHistory, cartCount, cartSubtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export { CartProvider, useCart };
