import React from 'react';

const ImagePreviewModal = ({ url, onClose }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Certificate Preview</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Image Container with Zoom effect via hover/scroll optional (basic max-h for now) */}
        <div className="p-6 overflow-auto flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50">
          <img 
            src={url} 
            alt="Medical Certificate Link" 
            className="max-w-full h-auto object-contain cursor-zoom-in hover:scale-[1.02] transition-transform duration-300 shadow-md"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'; }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
