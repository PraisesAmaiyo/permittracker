'use client';
import mockData from '@/data/mockDashboard.json';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import DocumentModals from './DocumentModals';
import Button from './ui/Button';

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

        <Button
          variant="primary"
          fullWidth={false}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Icon icon="solar:add-circle-bold" fontSize={20} />
          <span>New Permit</span>
        </Button>
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
