"use client";

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const NotificationComponent = ({ type, message, onClose }: NotificationProps) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${bgColor} text-white`}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 hover:opacity-80 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
};
