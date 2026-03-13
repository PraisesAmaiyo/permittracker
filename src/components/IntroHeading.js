'use client';
import mockData from '@/data/mockDashboard.json';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import DocumentModals from './DocumentModals';

export default function IntroHeading({ title, subText }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            {subText}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 shrink-0  cursor-pointer "
        >
          <Icon icon="solar:add-circle-bold" fontSize={20} />
          <span>New Permit</span>
        </button>
      </div>

      <DocumentModals
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
      />
    </>
  );
}

// className =
//   'p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all';
