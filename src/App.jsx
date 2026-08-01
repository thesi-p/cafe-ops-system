import { AppProvider } from './context/AppContext';
import Dashboard      from './Pages/Dashboard';
import ToastContainer from './components/Toast';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Dashboard />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
