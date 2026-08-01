import React from 'react';
import { X, ZoomIn, Download } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700 text-white">
          <div className="flex items-center space-x-2">
            <ZoomIn className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm sm:text-base text-slate-100">{title}</h3>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer flex items-center text-xs font-semibold"
            >
              <Download className="w-4 h-4 mr-1.5 text-emerald-400" />
              <span>Full Size</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="p-6 flex items-center justify-center min-h-[400px] max-h-[80vh] overflow-auto bg-slate-950/60">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-slate-800"
          />
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs text-center font-medium">
          Official Identity Verification Document • JobsHub Government & Corporate Portal
        </div>
      </div>
    </div>
  );
};
