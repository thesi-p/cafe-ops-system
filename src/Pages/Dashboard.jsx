import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { page = 'overview' } = useParams();
  const currentPage = Object.hasOwn(PAGES, page) ? page : 'overview';
  const PageComponent = PAGES[currentPage] || Overview;

  const handleNavigate = (nextPage) => {
    navigate(`/${nextPage}`);
  };

  return (
    <div className="app-shell">
      <Sidebar active={currentPage} onNavigate={handleNavigate} />
      <div className="main-area">
        <Topbar page={currentPage} />
        <main
          className="page-content"
          style={currentPage === 'order' ? { overflow: 'hidden', padding: '20px 24px', display: 'flex', flexDirection: 'column' } : {}}
        >
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
