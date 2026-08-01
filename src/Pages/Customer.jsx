import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toast } from '../components/Toast';
import './Customer.css';

function CustomerModal({ customer, onSave, onClose }) {
  const isNew = !customer;
  const [form, setForm] = useState(customer || { name: '', phone: '', email: '', totalPurchases: 0, visits: 0, balance: 0 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { toast('Name and phone required', 'error'); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="section-title" style={{ fontSize: 16 }}>{isNew ? 'Add Customer' : 'Edit Customer'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input id="cust-name" className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Customer name" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input id="cust-phone" className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit number" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input id="cust-email" className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>
            </div>
            {!isNew && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Total Purchases (₹)</label>
                  <input className="form-input" type="number" value={form.totalPurchases} onChange={e => set('totalPurchases', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Visits</label>
                  <input className="form-input" type="number" value={form.visits} onChange={e => set('visits', parseInt(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Balance (₹)</label>
                  <input className="form-input" type="number" value={form.balance} onChange={e => set('balance', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button id="save-customer-btn" type="submit" className="btn btn-primary">{isNew ? '+ Add Customer' : '💾 Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Customer() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState(null); // null | 'add' | customer object
  const [confirmId, setConfirmId] = useState(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form) => {
    if (modal === 'add') {
      addCustomer(form);
      toast('Customer added ✅', 'success');
    } else {
      updateCustomer(modal.id, form);
      toast('Customer updated ✅', 'success');
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    deleteCustomer(id);
    setConfirmId(null);
    toast('Customer removed', 'info');
  };

  return (
    <div className="customer-page">
      {/* Header */}
      <div className="customer-header">
        <div>
          <h1 className="section-title">Customers</h1>
          <p className="section-sub">{customers.length} registered customers</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
            <input
              id="customer-search"
              className="form-input"
              style={{ paddingLeft: 34, width: 240 }}
              placeholder="Search customers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button id="add-customer-btn" className="btn btn-primary" onClick={() => setModal('add')}>
            + Add Customer
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card customer-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Visits</th>
              <th>Total Spent</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-3)' }}>
                  No customers found.
                </td>
              </tr>
            )}
            {filtered.map((c, idx) => (
              <tr key={c.id}>
                <td style={{ color: 'var(--text-3)', fontWeight: 600 }}>{idx + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="cust-avatar">{c.name.charAt(0).toUpperCase()}</div>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{c.name}</span>
                  </div>
                </td>
                <td>{c.phone}</td>
                <td style={{ color: 'var(--text-3)' }}>{c.email || '—'}</td>
                <td>
                  <span className="badge badge-blue">{c.visits} visits</span>
                </td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>
                  ₹{c.totalPurchases.toLocaleString('en-IN')}
                </td>
                <td>
                  <span className={`badge ${c.balance > 0 ? 'badge-amber' : c.balance < 0 ? 'badge-red' : 'badge-green'}`}>
                    {c.balance > 0 ? `+₹${c.balance}` : c.balance < 0 ? `-₹${Math.abs(c.balance)}` : 'Settled'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      id={`edit-cust-${c.id}`}
                      className="btn btn-ghost btn-sm"
                      onClick={() => setModal(c)}
                    >✏️ Edit</button>
                    <button
                      id={`del-cust-${c.id}`}
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmId(c.id)}
                    >🗑 Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {modal && (
        <CustomerModal
          customer={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div className="modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="modal-box" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="section-title" style={{ fontSize: 15 }}>Confirm Delete</span>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-2)', marginBottom: 20, fontSize: 14 }}>
                This will permanently remove the customer record.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
                <button
                  id="confirm-delete-cust"
                  className="btn btn-danger"
                  onClick={() => handleDelete(confirmId)}
                >Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
