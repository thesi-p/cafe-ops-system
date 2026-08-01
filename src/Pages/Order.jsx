import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { toast } from '../components/Toast';
import './Order.css';

const CATEGORY_TABS = ['All', 'Coffee', 'Tea', 'Smoothies', 'Desserts', 'Snacks'];

// ─── Print receipt (opens native print dialog) ─────────────────────────────────
function printReceipt(order) {
  const el = document.getElementById('print-receipt');
  if (!el) return;
  el.innerHTML = buildReceiptHTML(order);
  window.print();
}

function buildReceiptHTML({ items, subtotal, discount, total, payment, paidAmount, balance, orderNo, time }) {
  const rows = items.map(i =>
    `<tr>
      <td>${i.name}</td>
      <td style="text-align:center">${i.qty}</td>
      <td style="text-align:right">LKR${(i.price * i.qty).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
    <div style="text-align:center;margin-bottom:12px">
      <div style="font-size:22px">☕</div>
      <strong style="font-size:18px">BrewDesk Cafe</strong><br/>
      <small>Demo Receipt</small>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:8px">
      <span>${orderNo}</span><span>${time}</span>
    </div>
    <hr/>
    <table style="width:100%;font-size:12px;border-collapse:collapse">
      <thead>
        <tr>
          <th style="text-align:left">Item</th>
          <th style="text-align:center">Qty</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <hr/>
    <div style="font-size:12px">
      <div style="display:flex;justify-content:space-between"><span>Subtotal</span><span>LKR${subtotal.toFixed(2)}</span></div>
      ${discount > 0 ? `<div style="display:flex;justify-content:space-between"><span>Discount</span><span>-LKR${discount.toFixed(2)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:14px;margin-top:4px"><span>TOTAL</span><span>LKR${total.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-top:4px"><span>Paid (${payment})</span><span>LKR${Number(paidAmount).toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between"><span>Balance</span><span>LKR${balance.toFixed(2)}</span></div>
    </div>
    <hr/>
    <div style="text-align:center;font-size:11px;margin-top:8px">
      Thank you for visiting BrewDesk!<br/>
      <em>Powered by BrewDesk POS Demo</em>
    </div>
  `;
}

// ─── Product Card ───────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  return (
    <button
      id={`product-card-${product.id}`}
      className={`product-card ${!product.available ? 'unavailable' : ''}`}
      onClick={() => product.available && onAdd(product)}
      disabled={!product.available}
    >
      <span className="product-emoji">{product.emoji}</span>
      <span className="product-name">{product.name}</span>
      <div className="product-footer">
        <span className="product-price">LKR{product.price}</span>
        {!product.available && <span className="badge badge-red" style={{ fontSize: 9 }}>OUT</span>}
      </div>
    </button>
  );
}

// ─── Bill Item Row ──────────────────────────────────────────────────────────────
function BillItem({ item, onQtyChange, onRemove }) {
  return (
    <div className="bill-item">
      <div className="bill-item-info">
        <span className="bill-item-name">{item.name}</span>
        <span className="bill-item-unit">LKR{item.price} each</span>
      </div>
      <div className="bill-qty-ctrl">
        <button
          id={`qty-dec-${item.id}`}
          className="qty-btn"
          onClick={() => onQtyChange(item.id, item.qty - 1)}
        >−</button>
        <span className="qty-val">{item.qty}</span>
        <button
          id={`qty-inc-${item.id}`}
          className="qty-btn"
          onClick={() => onQtyChange(item.id, item.qty + 1)}
        >+</button>
      </div>
      <div className="bill-item-subtotal">LKR{(item.price * item.qty).toLocaleString('en-IN')}</div>
      <button
        id={`remove-item-${item.id}`}
        className="bill-remove-btn"
        onClick={() => onRemove(item.id)}
        title="Remove"
      >✕</button>
    </div>
  );
}

// ─── Order Page ─────────────────────────────────────────────────────────────────
export default function Order() {
  const { products, addOrder } = useApp();
  const [activeTab, setActiveTab]     = useState('All');
  const [search, setSearch]           = useState('');
  const [billItems, setBillItems]     = useState([]);
  const [discount, setDiscount]       = useState('');
  const [paidAmount, setPaidAmount]   = useState('');
  const [payMethod, setPayMethod]     = useState('Cash');
  const [lastOrder, setLastOrder]     = useState(null);
  const printRef = useRef(null);

  // Filter products
  const visible = products.filter(p => {
    const matchCat  = activeTab === 'All' || p.category === activeTab;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Add item to bill
  const handleAdd = (product) => {
    setBillItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Change quantity
  const handleQty = (id, qty) => {
    if (qty <= 0) {
      setBillItems(prev => prev.filter(i => i.id !== id));
    } else {
      setBillItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    }
  };

  // Remove item
  const handleRemove = (id) => setBillItems(prev => prev.filter(i => i.id !== id));

  // Calculations
  const subtotal   = billItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = Math.min(parseFloat(discount) || 0, subtotal);
  const total      = subtotal - discountAmt;
  const paid       = parseFloat(paidAmount) || 0;
  const balance    = paid - total;

  // Place order
  const handlePlaceOrder = () => {
    if (billItems.length === 0) { toast('Add items to the bill first', 'error'); return; }
    if (paid < total)           { toast('Paid amount is less than total', 'error'); return; }

    const order = addOrder({
      items: billItems.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
      subtotal, discount: discountAmt, total, payment: payMethod,
      paidAmount: paid, balance,
    });
    setLastOrder({
      ...order, items: billItems, subtotal, discount: discountAmt,
      total, payment: payMethod, paidAmount: paid, balance,
    });
    toast(`Order ${order.orderNo} placed! Change: LKR${balance.toFixed(2)}`, 'success');
    // Reset bill
    setBillItems([]);
    setDiscount('');
    setPaidAmount('');
  };

  // Print
  const handlePrint = () => {
    if (!lastOrder) { toast('No order to print', 'error'); return; }
    printReceipt(lastOrder);
  };

  const clearBill = () => { setBillItems([]); setDiscount(''); setPaidAmount(''); };

  return (
    <div className="order-page">
      {/* ── Left: Products ── */}
      <div className="products-panel">
        {/* Search */}
        <div className="products-search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="product-search"
            type="text"
            className="form-input search-input"
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="category-tabs">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab}
              id={`tab-${tab}`}
              className={`cat-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="products-grid">
          {visible.length === 0 && (
            <div className="no-items">No items found</div>
          )}
          {visible.map(p => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      </div>

      {/* ── Right: Bill ── */}
      <div className="bill-panel">
        <div className="bill-header">
          <span className="bill-title">Current Bill</span>
          {billItems.length > 0 && (
            <button id="clear-bill" className="btn btn-ghost btn-sm" onClick={clearBill}>
              Clear
            </button>
          )}
        </div>

        {/* Bill items */}
        <div className="bill-items">
          {billItems.length === 0 ? (
            <div className="bill-empty">
              <span style={{ fontSize: 36 }}>🧾</span>
              <span>Click items to add them here</span>
            </div>
          ) : (
            billItems.map(item => (
              <BillItem
                key={item.id}
                item={item}
                onQtyChange={handleQty}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {/* Totals */}
        <div className="bill-summary">
          <div className="bill-row">
            <span>Subtotal</span>
            <span>LKR{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="bill-row">
            <span>Discount</span>
            <input
              id="discount-input"
              type="number"
              className="form-input bill-discount-input"
              placeholder="0"
              min="0"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
            />
          </div>
          {discountAmt > 0 && (
            <div className="bill-row text-green">
              <span>Saving</span>
              <span>−LKR{discountAmt.toFixed(2)}</span>
            </div>
          )}
          <div className="divider" style={{ margin: '10px 0' }} />
          <div className="bill-row bill-total-row">
            <span>Total</span>
            <span>LKR{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="bill-payment">
          <div className="payment-method-row">
            <button
              id="pay-cash"
              className={`pay-method-btn ${payMethod === 'Cash' ? 'active' : ''}`}
              onClick={() => setPayMethod('Cash')}
            >
              💵 Cash
            </button>
            <button
              id="pay-card"
              className={`pay-method-btn ${payMethod === 'Card' ? 'active' : ''}`}
              onClick={() => setPayMethod('Card')}
            >
              💳 Card
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="paid-amount">Customer Pays (LKR)</label>
            <input
              id="paid-amount"
              type="number"
              className="form-input"
              placeholder="Enter amount"
              min="0"
              value={paidAmount}
              onChange={e => setPaidAmount(e.target.value)}
            />
          </div>

          {paidAmount && (
            <div className={`balance-chip ${balance >= 0 ? 'positive' : 'negative'}`}>
              <span>{balance >= 0 ? '💚 Change' : '🔴 Due'}</span>
              <strong>LKR{Math.abs(balance).toFixed(2)}</strong>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="bill-actions">
          <button
            id="place-order-btn"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center' }}
            onClick={handlePlaceOrder}
          >
            ✅ Place Order
          </button>
          <button
            id="print-bill-btn"
            className="btn btn-ghost w-full"
            style={{ justifyContent: 'center' }}
            onClick={handlePrint}
            disabled={!lastOrder}
          >
            🖨️ Print Last Bill
          </button>
        </div>

        {lastOrder && (
          <div className="last-order-chip">
            <span>Last: <strong>{lastOrder.orderNo}</strong></span>
            <span className="badge badge-green">✓ Done</span>
          </div>
        )}
      </div>

      {/* Hidden print target */}
      <div id="print-receipt" ref={printRef} style={{ display: 'none' }} />
    </div>
  );
}
