const PAGE_META = {
  overview: { title: 'Overview',   sub: 'Dashboard / Overview'   },
  order:    { title: 'Orders',     sub: 'Dashboard / Orders'     },
  customer: { title: 'Customers',  sub: 'Dashboard / Customers'  },
  settings: { title: 'Settings',   sub: 'Dashboard / Settings'   },
};

export default function Topbar({ page }) {
  const meta = PAGE_META[page] || PAGE_META.overview;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-page-title">{meta.title}</span>
        <span className="topbar-breadcrumb">{meta.sub}</span>
      </div>
      <div className="topbar-right">
        <span className="topbar-date">📅 {dateStr}</span>
        <div id="topbar-avatar" className="topbar-avatar" title="Admin">A</div>
      </div>
    </header>
  );
}
