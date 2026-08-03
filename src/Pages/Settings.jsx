import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toast } from '../components/Toast';
import { CATEGORIES } from '../data/db';
import './Settings.css';

const EMPTY_PRODUCT = {
  name: '', category: 'Coffee', price: '', emoji: '☕', description: '', available: true,
};

function ProductModal({ product, onSave, onClose }) {
  const isNew = !product;
  const [form, setForm] = useState(product ? { ...product, price: String(product.price) } : { ...EMPTY_PRODUCT });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const EMOJI_OPTIONS = ['☕','🍵','🧊','🍫','🥛','🥭','🫐','🥑','🎂','🍰','🍮','🧇','🥪','🥐','🍞','🌽','🍋','🍹','🧃','🫖'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim())       { toast('Product name required', 'error'); return; }
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
      toast('Enter a valid price', 'error'); return;
    }
    onSave({ ...form, price: parseFloat(form.price) });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="section-title" style={{ fontSize: 16 }}>
            {isNew ? '+ Add Product' : '✏️ Edit Product'}
          </span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input id="prod-name" className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Iced Coffee" required />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select id="prod-category" className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Price (LKR) *</label>
                <input id="prod-price" className="form-input" type="number" min="1" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 150" required />
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <select id="prod-available" className="form-select" value={form.available ? 'yes' : 'no'} onChange={e => set('available', e.target.value === 'yes')}>
                  <option value="yes">✅ Available</option>
                  <option value="no">❌ Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input id="prod-desc" className="form-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short product description" />
            </div>
            <div className="form-group">
              <label className="form-label">Emoji / Icon</label>
              <div className="emoji-picker">
                {EMOJI_OPTIONS.map(em => (
                  <button
                    type="button"
                    key={em}
                    className={`emoji-opt ${form.emoji === em ? 'active' : ''}`}
                    onClick={() => set('emoji', em)}
                  >{em}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button id="save-product-btn" type="submit" className="btn btn-primary">
              {isNew ? '+ Add Product' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductRow({ product, onEdit, onDelete, onToggle }) {
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{product.emoji}</span>
          <div>
            <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 14 }}>{product.name}</div>
            <div style={{ color: 'var(--text-3)', fontSize: 11 }}>{product.description || '—'}</div>
          </div>
        </div>
      </td>
      <td>
        <span className={`badge ${
          product.category === 'Coffee'   ? 'badge-amber'  :
          product.category === 'Tea'      ? 'badge-green'  :
          product.category === 'Smoothies'? 'badge-blue'   :
          product.category === 'Desserts' ? 'badge-purple' : 'badge-cyan'
        }`}>{product.category}</span>
      </td>
      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>LKR{product.price}</td>
      <td>
        <button
          id={`toggle-${product.id}`}
          className={`status-toggle ${product.available ? 'on' : 'off'}`}
          onClick={() => onToggle(product.id, !product.available)}
          title="Toggle availability"
        >
          <span className="toggle-dot" />
          <span>{product.available ? 'Active' : 'Inactive'}</span>
        </button>
      </td>
      <td>
        <div style={{ display: 'flex', gap: 6 }}>
          <button id={`edit-prod-${product.id}`} className="btn btn-ghost btn-sm" onClick={() => onEdit(product)}>✏️ Edit</button>
          <button id={`del-prod-${product.id}`}  className="btn btn-danger btn-sm"  onClick={() => onDelete(product.id)}>🗑 Del</button>
        </div>
      </td>
    </tr>
  );
}

export default function Settings() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [search, setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [modal, setModal]      = useState(null); // null | 'add' | product
  const [confirmId, setConfirmId] = useState(null);

  const filtered = products.filter(p => {
    const matchCat  = catFilter === 'All' || p.category === catFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = (form) => {
    if (modal === 'add') {
      addProduct(form);
      toast('Product added ✅', 'success');
    } else {
      updateProduct(modal.id, form);
      toast('Product updated ✅', 'success');
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setConfirmId(null);
    toast('Product deleted', 'info');
  };

  const handleToggle = (id, available) => {
    updateProduct(id, { available });
    toast(available ? 'Marked as Available' : 'Marked as Out of Stock', 'info');
  };

  // Summary counts
  const totalActive = products.filter(p => p.available).length;
  const totalOut    = products.length - totalActive;

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h1 className="section-title">Product Settings</h1>
          <p className="section-sub">Manage all menu items — add, edit, delete, toggle availability</p>
        </div>
        <button id="add-product-btn" className="btn btn-primary" onClick={() => setModal('add')}>
          + Add Product
        </button>
      </div>

      {/* Summary chips */}
      <div className="settings-chips">
        <div className="settings-chip">
          <span className="chip-val">{products.length}</span>
          <span className="chip-label">Total Items</span>
        </div>
        <div className="settings-chip green">
          <span className="chip-val">{totalActive}</span>
          <span className="chip-label">Available</span>
        </div>
        <div className="settings-chip red">
          <span className="chip-val">{totalOut}</span>
          <span className="chip-label">Out of Stock</span>
        </div>
        {CATEGORIES.map(cat => (
          <div key={cat} className="settings-chip">
            <span className="chip-val">{products.filter(p => p.category === cat).length}</span>
            <span className="chip-label">{cat}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="settings-filters">
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
          <input
            id="settings-search"
            className="form-input"
            style={{ paddingLeft: 34 }}
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          id="settings-cat-filter"
          className="form-select"
          style={{ width: 160 }}
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card settings-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-3)' }}>
                  No products found.
                </td>
              </tr>
            )}
            {filtered.map(p => (
              <ProductRow
                key={p.id}
                product={p}
                onEdit={setModal}
                onDelete={setConfirmId}
                onToggle={handleToggle}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal-box" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="section-title" style={{ fontSize: 15 }}>Delete Product?</span>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-2)', marginBottom: 20, fontSize: 14 }}>
                This action cannot be undone. The product will be removed from the menu.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
                <button id="confirm-delete-prod" className="btn btn-danger" onClick={() => handleDelete(confirmId)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
