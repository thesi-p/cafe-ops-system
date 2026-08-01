import { useState, useEffect } from 'react';

let _addToast = null;

export function toast(message, type = 'success') {
  if (_addToast) _addToast({ message, type, id: Date.now() });
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = (t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3000);
    };
    return () => { _addToast = null; };
  }, []);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{icons[t.type] || '✅'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
