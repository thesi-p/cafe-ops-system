// src/data/db.js
// Local "database" seeded with demo cafe data. Uses localStorage for persistence.

export const CATEGORIES = ['Coffee', 'Tea', 'Smoothies', 'Desserts', 'Snacks'];

const DEFAULT_PRODUCTS = [
  // ─── Coffee ────────────────────────────────────────────────────
  { id: 'p1',  name: 'Espresso',         category: 'Coffee',   price: 120, emoji: '☕', available: true, description: 'Rich double-shot espresso' },
  { id: 'p2',  name: 'Cappuccino',       category: 'Coffee',   price: 180, emoji: '☕', available: true, description: 'Velvety cappuccino with foam art' },
  { id: 'p3',  name: 'Latte',            category: 'Coffee',   price: 200, emoji: '🥛', available: true, description: 'Smooth milk latte' },
  { id: 'p4',  name: 'Cold Brew',        category: 'Coffee',   price: 220, emoji: '🧊', available: true, description: '12-hour steeped cold brew' },
  { id: 'p5',  name: 'Mocha',            category: 'Coffee',   price: 210, emoji: '🍫', available: true, description: 'Coffee meets chocolate' },
  { id: 'p6',  name: 'Flat White',       category: 'Coffee',   price: 190, emoji: '☕', available: true, description: 'Australian-style flat white' },
  // ─── Tea ───────────────────────────────────────────────────────
  { id: 'p7',  name: 'Masala Chai',      category: 'Tea',      price: 80,  emoji: '🍵', available: true, description: 'Spiced Indian chai' },
  { id: 'p8',  name: 'Green Tea',        category: 'Tea',      price: 90,  emoji: '🍵', available: true, description: 'Premium Japanese green tea' },
  { id: 'p9',  name: 'Earl Grey',        category: 'Tea',      price: 100, emoji: '🍵', available: true, description: 'Classic bergamot tea' },
  { id: 'p10', name: 'Iced Lemon Tea',   category: 'Tea',      price: 110, emoji: '🍋', available: true, description: 'Refreshing iced lemon tea' },
  // ─── Smoothies ─────────────────────────────────────────────────
  { id: 'p11', name: 'Mango Smoothie',   category: 'Smoothies',price: 160, emoji: '🥭', available: true, description: 'Fresh mango blend' },
  { id: 'p12', name: 'Berry Blast',      category: 'Smoothies',price: 170, emoji: '🫐', available: true, description: 'Mixed berry smoothie' },
  { id: 'p13', name: 'Avocado Shake',    category: 'Smoothies',price: 190, emoji: '🥑', available: false, description: 'Creamy avocado shake' },
  // ─── Desserts ──────────────────────────────────────────────────
  { id: 'p14', name: 'Chocolate Cake',   category: 'Desserts', price: 150, emoji: '🎂', available: true, description: 'Rich moist chocolate cake slice' },
  { id: 'p15', name: 'Cheesecake',       category: 'Desserts', price: 160, emoji: '🍰', description: 'New York style cheesecake', available: true },
  { id: 'p16', name: 'Tiramisu',         category: 'Desserts', price: 170, emoji: '🍮', available: true, description: 'Classic Italian tiramisu' },
  { id: 'p17', name: 'Waffle',           category: 'Desserts', price: 140, emoji: '🧇', available: true, description: 'Belgian waffle with maple syrup' },
  { id: 'p18', name: 'Brownie',          category: 'Desserts', price: 100, emoji: '🍫', available: true, description: 'Fudgy walnut brownie' },
  // ─── Snacks ────────────────────────────────────────────────────
  { id: 'p19', name: 'Club Sandwich',    category: 'Snacks',   price: 180, emoji: '🥪', available: true, description: 'Triple-decker club sandwich' },
  { id: 'p20', name: 'Croissant',        category: 'Snacks',   price: 90,  emoji: '🥐', available: true, description: 'Buttery French croissant' },
  { id: 'p21', name: 'Garlic Bread',     category: 'Snacks',   price: 70,  emoji: '🍞', available: true, description: 'Toasted garlic butter bread' },
  { id: 'p22', name: 'Nachos',           category: 'Snacks',   price: 130, emoji: '🌽', available: false, description: 'Crispy nachos with salsa' },
];

const DEFAULT_CUSTOMERS = [
  { id: 'c1', name: 'Arjun Sharma',   phone: '9876543210', email: 'arjun@email.com',  totalPurchases: 4200, visits: 12, balance: 0    },
  { id: 'c2', name: 'Priya Nair',     phone: '9845001234', email: 'priya@email.com',   totalPurchases: 2800, visits: 8,  balance: 150  },
  { id: 'c3', name: 'Rahul Verma',    phone: '9123456789', email: 'rahul@email.com',   totalPurchases: 6500, visits: 21, balance: 0    },
  { id: 'c4', name: 'Sneha Kapoor',   phone: '9988776655', email: 'sneha@email.com',   totalPurchases: 1200, visits: 4,  balance: -50  },
  { id: 'c5', name: 'Vikram Singh',   phone: '9001122334', email: 'vikram@email.com',  totalPurchases: 3100, visits: 10, balance: 0    },
  { id: 'c6', name: 'Meera Pillai',   phone: '9876001122', email: 'meera@email.com',   totalPurchases: 890,  visits: 3,  balance: 200  },
  { id: 'c7', name: 'Aditya Rao',     phone: '9551234567', email: 'aditya@email.com',  totalPurchases: 5400, visits: 16, balance: 0    },
];

// Generate demo orders spread across today with realistic amounts
function generateDemoOrders() {
  const now = new Date();
  const today = now.toDateString();
  const orders = [];
  const sampleItems = [
    { name: 'Espresso', price: 120 },
    { name: 'Cappuccino', price: 180 },
    { name: 'Chocolate Cake', price: 150 },
    { name: 'Club Sandwich', price: 180 },
    { name: 'Masala Chai', price: 80 },
    { name: 'Tiramisu', price: 170 },
    { name: 'Cold Brew', price: 220 },
    { name: 'Waffle', price: 140 },
  ];

  const orderData = [
    { hour: 8, min: 12, items: [sampleItems[0], sampleItems[4]],       payment: 'Cash' },
    { hour: 9, min: 5,  items: [sampleItems[1], sampleItems[2]],       payment: 'Card' },
    { hour: 9, min: 45, items: [sampleItems[3]],                        payment: 'Cash' },
    { hour: 10, min: 20,items: [sampleItems[6], sampleItems[5]],       payment: 'Card' },
    { hour: 11, min: 10,items: [sampleItems[1], sampleItems[7]],       payment: 'Cash' },
    { hour: 11, min: 50,items: [sampleItems[0], sampleItems[2], sampleItems[4]], payment: 'Card' },
    { hour: 12, min: 30,items: [sampleItems[3], sampleItems[5]],       payment: 'Cash' },
    { hour: 13, min: 15,items: [sampleItems[6], sampleItems[7]],       payment: 'Card' },
    { hour: 14, min: 0, items: [sampleItems[1], sampleItems[2], sampleItems[3]], payment: 'Cash' },
    { hour: 15, min: 22,items: [sampleItems[0], sampleItems[6]],       payment: 'Card' },
    { hour: 16, min: 45,items: [sampleItems[4], sampleItems[5], sampleItems[7]], payment: 'Cash' },
  ];

  orderData.forEach((o, idx) => {
    const t = new Date(now);
    t.setHours(o.hour, o.min, 0, 0);
    if (t > now) return; // don't create future orders
    const subtotal = o.items.reduce((s, i) => s + i.price, 0);
    orders.push({
      id: `ord-${idx + 1}`,
      orderNo: `#${String(1001 + idx).padStart(4, '0')}`,
      items: o.items.map(i => ({ ...i, qty: 1 })),
      subtotal,
      discount: 0,
      total: subtotal,
      payment: o.payment,
      date: today,
      time: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: t.getTime(),
    });
  });
  return orders;
}

// ── Storage helpers ────────────────────────────────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return fallback;
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
}

// ── Public API ─────────────────────────────────────────────────────────────────
export function getProducts() { return load('bd_products', DEFAULT_PRODUCTS); }
export function saveProducts(products) { save('bd_products', products); }

export function getCustomers() { return load('bd_customers', DEFAULT_CUSTOMERS); }
export function saveCustomers(customers) { save('bd_customers', customers); }

export function getOrders() {
  const stored = load('bd_orders', null);
  if (stored) return stored;
  const demo = generateDemoOrders();
  save('bd_orders', demo);
  return demo;
}
export function saveOrders(orders) { save('bd_orders', orders); }

export function resetAll() {
  localStorage.removeItem('bd_products');
  localStorage.removeItem('bd_customers');
  localStorage.removeItem('bd_orders');
}
