'use client';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import mockData from '@/data/mockDashboard.json';
import Header from '@/components/Header';
import IntroHeading from '@/components/IntroHeading';
import RepositoryTable from '@/components/RepositoryTable';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DocumentRepository() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';

  // Inside your component:
  const router = useRouter();

  //  Enhanced Filter Logic (Filter + Search)
  const filteredDocs = mockData.allDocuments.filter((doc) => {
    const matchesFilter =
      activeFilter === 'all' ||
      doc.status.toLowerCase().replace(' ', '-') === activeFilter.toLowerCase();

    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // 2. Pagination Logic
  const paginatedDocs = filteredDocs.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 lg:ml-72 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
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

          {/* Action Buttons (Screen 2) */}
          <div className="grid grid-cols-2 md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full md:w-fit gap-1 ">
            {['All', 'Active', 'Expiring Soon', 'Expired'].map((tab) => {
              const filterValue = tab.toLowerCase().replace(' ', '-');
              const isActive =
                activeFilter === (tab === 'All' ? 'all' : filterValue);

              return (
                <button
                  key={tab}
                  onClick={() =>
                    router.push(
                      `/documents?filter=${tab === 'All' ? 'all' : filterValue}`,
                    )
                  }
                  className={`px-4 py-2.5 text-sm rounded-lg transition-all text-center  cursor-pointer  ${
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

          <RepositoryTable documents={paginatedDocs} />

          <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-sm text-slate-500">
              Showing {paginatedDocs.length} of {filteredDocs.length} documents
            </p>

            {visibleCount < filteredDocs.length && (
              <button
                onClick={() => {
                  // Optional: add a tiny setTimeout here to simulate a "loading" state
                  handleLoadMore();
                }}
                className="group px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2  cursor-pointer "
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

        {/* The big Repository Table goes here (similar to RecentDocuments but with more columns) */}
      </main>
    </div>
  );
}
