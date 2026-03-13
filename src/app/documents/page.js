'use client';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import mockData from '@/data/mockDashboard.json';
import Header from '@/components/Header';
import IntroHeading from '@/components/IntroHeading';
import RepositoryTable from '@/components/RepositoryTable';
import { Icon } from '@iconify/react';
import { useEffect, useState, Suspense } from 'react'; // 1. Added Suspense here
import { useRouter } from 'next/navigation';
import { useLayout } from '@/context/LayoutContext';
import DocumentModals from '@/components/DocumentModals';

// 2. Rename the main function to a "Content" component
function DocumentRepositoryContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(10);
  const router = useRouter();
  const { isCollapsed } = useLayout();

  // ... (All your existing logic remains exactly the same) ...
  const activeParamSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(activeParamSearch);

  //   Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(activeParamSearch);
  }, [activeParamSearch]);

  const activeFilter = searchParams.get('filter') || 'all';

  const filteredDocs = mockData.allDocuments.filter((doc) => {
    const matchesFilter =
      activeFilter === 'all' ||
      doc.status.toLowerCase().replace(' ', '-') === activeFilter.toLowerCase();

    const searchTarget =
      `${doc.name} ${doc.category} ${doc.responsibleName}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const paginatedDocs = filteredDocs.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <>
      <div className="flex min-h-screen">
        {/* ... Your existing JSX (Sidebar, Main, Header, etc.) ... */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
        >
          <Header
            headerName={'Document Repository'}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="p-4 md:p-8 space-y-8 overflow-y-auto overflow-x-hidden">
            <div>
              <IntroHeading
                title={'All Permits'}
                subText={'Manage all your permits and documents in one place.'}
              />
            </div>

            {/* Tab Buttons */}
            <div className="grid grid-cols-2 md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-fit gap-1 ">
              {['All', 'Active', 'Expiring Soon', 'Expired'].map((tab) => {
                const filterValue = tab.toLowerCase().replace(' ', '-');
                const isActive =
                  activeFilter === (tab === 'All' ? 'all' : filterValue);

                return (
                  <button
                    key={tab}
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.set('filter', tab === 'All' ? 'all' : filterValue);
                      if (searchQuery) {
                        params.set('search', searchQuery);
                      } else {
                        params.delete('search');
                      }
                      router.push(`/documents?${params.toString()}`);
                    }}
                    className={`px-4 py-2.5 text-sm rounded-lg transition-all text-center cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-slate-700 shadow-sm font-bold text-primary dark:text-slate-100'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {(activeParamSearch || activeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  router.push('/documents');
                }}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors mb-4 cursor-pointer"
              >
                <Icon icon="solar:refresh-linear" />
                Reset All Filters
              </button>
            )}

            <RepositoryTable documents={paginatedDocs} />

            <div className="flex flex-col items-center gap-4 mt-8">
              <p className="text-sm text-slate-500">
                Showing {paginatedDocs.length} of {filteredDocs.length}{' '}
                documents
              </p>

              {visibleCount < filteredDocs.length && (
                <button
                  onClick={handleLoadMore}
                  className="group px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer "
                >
                  Load More
                  <Icon
                    icon="solar:round-alt-arrow-down-bold"
                    className="group-hover:translate-y-1 transition-transform"
                  />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// 3. The final Export that Next.js uses as the Page
export default function DocumentRepository() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-slate-500 animate-pulse">Loading Repository...</p>
        </div>
      }
    >
      <DocumentRepositoryContent />
    </Suspense>
  );
}
