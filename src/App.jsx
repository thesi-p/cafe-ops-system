import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard      from './Pages/Dashboard';
import ToastContainer from './components/Toast';
import DemoModal      from './components/DemoModal';
import './index.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <DemoModal />

        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/:page" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
