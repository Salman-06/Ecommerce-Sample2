import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ToastProps {
  toasts?: ToastMessage[];
  onDismiss?: (id: string) => void;
  message?: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  toasts, 
  onDismiss, 
  message, 
  type = 'success', 
  onClose 
}) => {
  // If used as single toast
  if (message) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <SingleToastItem message={message} type={type} onClose={onClose || (() => {})} />
      </div>
    );
  }

  // If used with array
  if (toasts && toasts.length > 0) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss || (() => {})} />
        ))}
      </div>
    );
  }

  return null;
};

const SingleToastItem: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const bgStyles = {
    success: 'bg-[#1C1917] text-[#FAF8F5] border-[#C5A880]/40',
    error: 'bg-[#451A1A] text-[#FAF8F5] border-red-400/40',
    info: 'bg-[#1C1917] text-[#FAF8F5] border-[#C5A880]/30'
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  }[type];

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border text-sm transition-all duration-300 transform translate-y-0 ${bgStyles}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${type === 'success' ? 'text-[#C5A880]' : type === 'error' ? 'text-red-300' : 'text-amber-300'}`} />
        <span className="font-medium tracking-wide">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-3 text-stone-400 hover:text-white p-1 rounded-full transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyles = {
    success: 'bg-[#1C1917] text-[#FAF8F5] border-[#C5A880]/40',
    error: 'bg-[#451A1A] text-[#FAF8F5] border-red-400/40',
    info: 'bg-[#1C1917] text-[#FAF8F5] border-[#C5A880]/30'
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border text-sm transition-all duration-300 transform translate-y-0 ${bgStyles}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${toast.type === 'success' ? 'text-[#C5A880]' : toast.type === 'error' ? 'text-red-300' : 'text-amber-300'}`} />
        <span className="font-medium tracking-wide">{toast.message}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-3 text-stone-400 hover:text-white p-1 rounded-full transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
