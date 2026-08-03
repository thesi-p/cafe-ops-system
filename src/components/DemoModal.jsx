import { useState, useEffect } from 'react';
import './DemoModal.css';

function DemoModal() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show modal for 5 minutes then hide
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2 * 60 * 1000); // 2 minutes in milliseconds

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    window.open('https://kaniyan.pro', '_blank');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="demo-modal-overlay">
      <div className="demo-modal-content">
        <button className="demo-modal-close" onClick={handleClose}>×</button>
        <h2>Demo Version</h2>
        <p>This is a demo version of our application.</p>
        <button className="demo-modal-btn" onClick={handleRedirect}>
          Visit kaniyan.pro
        </button>
      </div>
    </div>
  );
}

export default DemoModal;
