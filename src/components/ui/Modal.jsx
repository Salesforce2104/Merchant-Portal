"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      {/* Modal Container */}
      <div className="relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
        {/* Close Button - Floating */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-gray-500 shadow-md hover:bg-white hover:text-gray-800 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        {/* Modal Content */}
        <div className="w-[540px] bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1F3C88] to-[#2b4a9c] px-6 py-4">
            <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-5">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
