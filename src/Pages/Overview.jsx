import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import './Overview.css';

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon, trend }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
        {trend && (
          <span className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value">LKR {value.toLocaleString('en-IN')}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function StatCardCount({ label, value, icon, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ─── Mini Bar Chart ────────────────────────────────────────────────────────────
function SalesChart({ orders }) {
  // Build hourly buckets for today
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7am – 8pm
  const buckets = useMemo(() => {
    const map = {};
    hours.forEach(h => { map[h] = 0; });
    orders.forEach(o => {
      const ts = new Date(o.timestamp);
      const h = ts.getHours();
      if (h >= 7 && h <= 20) map[h] = (map[h] || 0) + o.total;
    });
    return hours.map(h => ({ hour: h, value: map[h] }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);

  const max = Math.max(...buckets.map(b => b.value), 1);

  return (
    <div className="chart-section">
      <div className="chart-bars">
        {buckets.map(b => (
          <div key={b.hour} className="chart-bar-col">
            <div className="chart-bar-wrap">
              <div
                className={`chart-bar ${b.value > 0 ? 'active' : ''}`}
                style={{ height: `${Math.max((b.value / max) * 100, b.value > 0 ? 8 : 2)}%` }}
                title={`LKR          ${b.value}`}
              />
            </div>
            <span className="chart-hour">
              {b.hour === 12 ? '12' : b.hour > 12 ? `${b.hour - 12}p` : `${b.hour}a`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Orders ──────────────────────────────────────────────────────────────
function RecentOrders({ orders }) {
  const recent = [...orders].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
  return (
    <div className="card recent-orders-card">
      <div className="card-header">
        <span className="section-title" style={{ fontSize: 15 }}>Recent Orders</span>
        <span className="badge badge-blue">{orders.length} today</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Items</th>
            <th>Time</th>
            <th>Payment</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {recent.map(o => (
            <tr key={o.id}>
              <td><span style={{ color: 'var(--accent)', fontWeight: 600 }}>{o.orderNo}</span></td>
              <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
              <td>{o.time}</td>
              <td>
                <span className={`badge ${o.payment === 'Cash' ? 'badge-green' : 'badge-blue'}`}>
                  {o.payment}
                </span>
              </td>
              <td style={{ color: 'var(--text)', fontWeight: 600 }}>LKR  {o.total.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Top Products ───────────────────────────────────────────────────────────────
function TopProducts({ orders }) {
  const productMap = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      o.items.forEach(it => {
        if (!map[it.name]) map[it.name] = { name: it.name, qty: 0, revenue: 0 };
        map[it.name].qty     += it.qty || 1;
        map[it.name].revenue += it.price * (it.qty || 1);
      });
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const maxQty = Math.max(...productMap.map(p => p.qty), 1);

  return (
    <div className="card top-products-card">
      <div className="card-header">
        <span className="section-title" style={{ fontSize: 15 }}>Top Sellers</span>
        <span className="text-sm text-dimmed">by quantity</span>
      </div>
      <div className="top-products-list">
        {productMap.map((p, i) => (
          <div key={p.name} className="top-product-row">
            <span className="top-product-rank">{i + 1}</span>
            <div className="top-product-info">
              <span className="top-product-name">{p.name}</span>
              <div className="top-product-bar-wrap">
                <div className="top-product-bar" style={{ width: `${(p.qty / maxQty) * 100}%` }} />
              </div>
            </div>
            <span className="top-product-qty">{p.qty} sold</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Page ──────────────────────────────────────────────────────────────
export default function Overview() {
  const { stats } = useApp();
  const { totalOrders, revenue, profit, loss, allOrders } = stats;
  const todayOrders = allOrders.filter(o => o.date === new Date().toDateString());

  return (
    <div className="overview-page">
      <div className="overview-header">
        <div>
          <h1 className="section-title">Good {getGreeting()} 👋</h1>
          <p className="section-sub">Here's what's happening at BrewDesk today.</p>
        </div>
        <span className="demo-badge">DEMO MODE</span>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCardCount label="Today's Orders"  value={totalOrders}     icon="🧾" color="amber"  />
        <StatCard      label="Total Revenue"   value={revenue}         icon="💰" color="green"  trend={12} />
        <StatCard      label="Net Profit"      value={Math.round(profit)} icon="📈" color="blue" trend={8}  />
        <StatCard      label="Losses"          value={loss}            icon="📉" color="red"   sub="No losses today" />
      </div>

      {/* Chart + top products */}
      <div className="overview-mid">
        <div className="card chart-card">
          <div className="card-header">
            <span className="section-title" style={{ fontSize: 15 }}>Sales by Hour</span>
            <span className="badge badge-amber">Today</span>
          </div>
          <SalesChart orders={todayOrders} />
          <div className="chart-legend">
            <span>Total: <strong>LKR           {revenue.toLocaleString('en-IN')}</strong></span>
            <span style={{ color: 'var(--text-3)' }}>across {totalOrders} orders</span>
          </div>
        </div>
        <TopProducts orders={todayOrders} />
      </div>

      {/* Recent orders */}
      <RecentOrders orders={todayOrders} />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
