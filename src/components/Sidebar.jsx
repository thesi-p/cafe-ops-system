import { useState, useEffect } from 'react';
import '../styles/Sidebar.css';

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',  icon: '▦',  emoji: true },
  { id: 'order',     label: 'Orders',    icon: '🧾', emoji: true },
  { id: 'customer',  label: 'Customers', icon: '👥', emoji: true },
  { id: 'settings',  label: 'Settings',  icon: '⚙️', emoji: true },
];

export default function Sidebar({ active, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime]           = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">☕</div>
        <div className="sidebar-logo-text">
          <span className="brand">BrewDesk</span>
          <span className="tagline">CAFE OPERATIONS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">MENU</div>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-label">{item.label}</span>
            {collapsed && <span className="tooltip">{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Time */}
      <div className="sidebar-time">🕐 {time}</div>

      {/* Toggle */}
      <div className="sidebar-toggle">
        <button
          id="sidebar-toggle-btn"
          className="toggle-btn"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
    </aside>
  );
}