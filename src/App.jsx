import { AppProvider } from './context/AppContext';
import Dashboard      from './Pages/Dashboard';
import ToastContainer from './components/Toast';
import DemoModal      from './components/DemoModal';
import './index.css';

function App() {
  return (
    <AppProvider>
      <DemoModal />
      <Dashboard />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
