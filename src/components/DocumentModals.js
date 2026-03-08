import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function DocumentModals({
  isPreviewOpen,
  setIsPreviewOpen,
  isAddModalOpen,
  setIsAddModalOpen,
  selectedDoc, // The doc object from the table
}) {
  return (
    <>
      {/* 1. PDF PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 dark:bg-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {selectedDoc?.name || 'Document Preview'}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDoc?.category}
                </p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <Icon icon="solar:close-circle-bold" fontSize={24} />
              </button>
            </div>

            <div className="flex-1 bg-slate-100 dark:bg-slate-950">
              {/* Placeholder logic: Always shows the same file but feels dynamic */}
              <iframe
                src="/sample-permit.pdf#toolbar=0"
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD NEW PERMIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Upload New Permit
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Permit Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. NUPRC Operational Permit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Category
                  </label>
                  <select className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none text-sm">
                    <option>Upstream</option>
                    <option>Safety</option>
                    <option>Environment</option>
                  </select>
                </div>
              </div>

              {/* Mock Dropzone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                <Icon
                  icon="solar:cloud-upload-bold"
                  className="mx-auto text-primary mb-2"
                  fontSize={32}
                />
                <p className="text-sm font-medium dark:text-slate-300">
                  Click to upload or drag & drop
                </p>
                <p className="text-[10px] text-slate-500">
                  PDF, PNG or JPG (max. 10MB)
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:opacity-90 transition-all">
                  Save Permit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
