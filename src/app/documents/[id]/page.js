'use client';
import { useParams, useRouter } from 'next/navigation';
import mockData from '@/data/mockDashboard.json';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { getFileIcon } from '@/utils/fileHelpers';
import DocumentModals from '@/components/DocumentModals';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DocumentDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [permit, setPermit] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchSinglePermit = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('permits')
        .select(
          `
        *,
        categories (name)
      `,
        )
        .eq('id', id) // Only get the one matching the URL
        .single(); // Tells Supabase to return an object {}, not an array []

      console.log('data', data);
      if (data) setPermit(data);
      setLoading(false);
    };

    if (id) fetchSinglePermit();
  }, [id]);

  if (loading) {
    return (
      <LoadingSingleDocumentInfo actionName={'Loading Permit Details...'} />
    );
  }

  if (!permit) {
    return <LoadingSingleDocumentInfo actionName={'Document Not Found!'} />;
  }

  if (permit) {
    const { icon, color } = getFileIcon(permit.file_url);

    return (
      <>
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Icon icon="solar:alt-arrow-right-linear" />
            <Link
              href="/documents"
              className="hover:text-primary transition-colors"
            >
              Documents
            </Link>
            <Icon icon={icon} className={color} fontSize={20} />
            <span className="text-slate-900 dark:text-slate-200 font-medium truncate">
              {permit.name}
            </span>
          </nav>

          {/* Header Section */}
          <div className="bg-white dark:bg-[#1a202c] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon icon={icon} className={color} fontSize={32} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold dark:text-white">
                    {permit.name}
                  </h1>
                  <p className="text-slate-500">{permit.category}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:eye-bold" />
                  View Document
                </button>

                <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Icon icon="solar:download-bold" />
                </button>

                <button className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Icon icon="solar:share-bold" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#1a202c] rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold mb-4 dark:text-white">
                  Compliance Overview
                </h3>
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Status
                    </p>
                    <span
                      className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        permit.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : permit.status === 'Expired'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {permit.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Expiry Date
                    </p>
                    <p className="mt-1 font-semibold dark:text-slate-200">
                      {new Date(permit.expiryDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Issue Date
                    </p>
                    <p className="mt-1 font-semibold dark:text-slate-200">
                      {new Date(permit.issueDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Regulatory Body
                    </p>
                    <p className="mt-1 font-semibold dark:text-slate-200">
                      {permit.name.split(' ')[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1a202c] rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold mb-4 dark:text-white">
                  Responsible Person
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                    {permit.responsibleInitials}
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">
                      {permit.responsibleName}
                    </p>
                    <p className="text-xs text-slate-500">Compliance Officer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DocumentModals
          isPreviewOpen={isPreviewOpen}
          setIsPreviewOpen={setIsPreviewOpen}
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          selectedDoc={permit}
        />
      </>
    );
  }
}

function LoadingSingleDocumentInfo({ actionName }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold">{actionName}</h2>
      <Link href="/documents" className="text-primary mt-4 underline">
        Back to Repository
      </Link>
    </div>
  );
}
