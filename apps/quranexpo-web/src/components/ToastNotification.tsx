// src/components/ToastNotification.tsx
import { useEffect, useState } from 'preact/hooks';

interface ToastNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; // in milliseconds
  onClose: () => void;
}

const ToastNotification = ({ message, type = 'info', duration = 3000, onClose }: ToastNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 rounded-lg shadow-lg text-white text-center transition-all duration-300 ease-out
        ${typeClasses[type]} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default ToastNotification;