import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { IconInfoCircleFill, IconExclamationCircleFill, IconCheckCircleFill, IconCloseCircleFill } from '@arco-design/web-react/icon';
import './Toast.css';

type ToastType = 'info' | 'warning' | 'success' | 'error';

interface ToastMessage {
  id: number;
  type: ToastType;
  content: string;
}

interface ToastContextType {
  showToast: (type: ToastType, content: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, content: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, content }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'info':
        return <IconInfoCircleFill className="toast-icon toast-icon-info" />;
      case 'warning':
        return <IconExclamationCircleFill className="toast-icon toast-icon-warning" />;
      case 'success':
        return <IconCheckCircleFill className="toast-icon toast-icon-success" />;
      case 'error':
        return <IconCloseCircleFill className="toast-icon toast-icon-error" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            {getIcon(toast.type)}
            <span className="toast-content">{toast.content}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
