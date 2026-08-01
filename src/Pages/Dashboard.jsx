import { useState } from 'react';
import Sidebar    from '../components/Sidebar';
import Topbar     from '../components/Topbar';
import Overview   from './Overview';
import Order      from './Order';
import Customer   from './Customer';
import Settings   from './Settings';

const PAGES = {
  overview: Overview,
  order:    Order,
  customer: Customer,
  settings: Settings,
};

export default function Dashboard() {
  const [page, setPage] = useState('overview');
  const PageComponent = PAGES[page] || Overview;

  return (
    <div className="app-shell">
      <Sidebar active={page} onNavigate={setPage} />
      <div className="main-area">
        <Topbar page={page} />
        <main
          className="page-content"
          style={page === 'order' ? { overflow: 'hidden', padding: '20px 24px', display: 'flex', flexDirection: 'column' } : {}}
        >
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
