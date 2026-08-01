// src/context/AppContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import {
  getProducts, saveProducts,
  getCustomers, saveCustomers,
  getOrders, saveOrders,
} from '../data/db';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProductsState] = useState(() => getProducts());
  const [customers, setCustomersState] = useState(() => getCustomers());
  const [orders, setOrdersState] = useState(() => getOrders());

  // ── Products ─────────────────────────────────────────────────────────────────
  const setProducts = useCallback((updated) => {
    setProductsState(updated);
    saveProducts(updated);
  }, []);

  const addProduct = useCallback((product) => {
    setProducts([...products, { ...product, id: `p${Date.now()}` }]);
  }, [products, setProducts]);

  const updateProduct = useCallback((id, changes) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...changes } : p));
  }, [products, setProducts]);

  const deleteProduct = useCallback((id) => {
    setProducts(products.filter(p => p.id !== id));
  }, [products, setProducts]);

  // ── Customers ────────────────────────────────────────────────────────────────
  const setCustomers = useCallback((updated) => {
    setCustomersState(updated);
    saveCustomers(updated);
  }, []);

  const addCustomer = useCallback((customer) => {
    setCustomers([...customers, { ...customer, id: `c${Date.now()}`, totalPurchases: 0, visits: 0, balance: 0 }]);
  }, [customers, setCustomers]);

  const updateCustomer = useCallback((id, changes) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...changes } : c));
  }, [customers, setCustomers]);

  const deleteCustomer = useCallback((id) => {
    setCustomers(customers.filter(c => c.id !== id));
  }, [customers, setCustomers]);

  // ── Orders ───────────────────────────────────────────────────────────────────
  const setOrders = useCallback((updated) => {
    setOrdersState(updated);
    saveOrders(updated);
  }, []);

  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNo: `#${String(1000 + orders.length + 1).padStart(4, '0')}`,
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };
    const updated = [...orders, newOrder];
    setOrders(updated);
    return newOrder;
  }, [orders, setOrders]);

  // ── Derived stats ─────────────────────────────────────────────────────────────
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter(o => o.date === todayStr);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const todayCost = todayRevenue * 0.38; // 38% COGS for demo
  const todayProfit = todayRevenue - todayCost;
  const todayLoss = 0; // demo – no loss days

  return (
    <AppContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      customers, addCustomer, updateCustomer, deleteCustomer,
      orders, addOrder,
      stats: {
        totalOrders: todayOrders.length,
        revenue: todayRevenue,
        profit: todayProfit,
        loss: todayLoss,
        allOrders: orders,
      }
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
