import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-6xl" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`bg-white w-full ${maxWidth} rounded-lg shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-xl font-serif font-bold text-zen-ink">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-zen-ink"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto bg-white flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};