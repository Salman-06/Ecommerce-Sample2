import React, { useState } from 'react';
import { X, Lock, Shield, User, AlertCircle } from 'lucide-react';
import { adminLogin } from '../services/storeService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = adminLogin(username, password);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-[#C5A880] flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#9E7D58]">
              LUMÉRA Management System
            </span>
            <h3 className="text-2xl font-serif-luxury font-bold text-stone-900 mt-1">
              Admin Portal Login
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Authorized personnel only. Access inventory, orders, and sales reports.
            </p>
          </div>

          {/* Quick Credential Hint Box */}
          <div className="mb-5 p-3.5 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl text-xs text-stone-700">
            <span className="font-bold text-[#9E7D58] block mb-1">Pre-filled Demo Credentials:</span>
            <div className="flex justify-between font-mono text-[11px] text-stone-600">
              <span>User: <strong className="text-stone-900">admin</strong></span>
              <span>Pass: <strong className="text-stone-900">password123</strong></span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Username or Admin Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-colors shadow-md mt-2"
            >
              Sign In to Admin Console
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
