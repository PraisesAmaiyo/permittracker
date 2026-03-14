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
import { supabase } from '@/lib/supabase';

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

  const [permits, setPermits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSearchQuery(activeParamSearch);
  }, [activeParamSearch]);

  const activeFilter = searchParams.get('filter') || 'all';

  const fetchPermits = async () => {
    try {
      setIsLoading(true);

      // We select everything, but we can also join 'categories'
      // to get the category name instead of just the ID!
      const { data, error } = await supabase
        .from('permits')
        .select(
          `
        *,
        categories (
          name
        )
      `,
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData = data.map((doc) => {
          // Logic to determine status based on expiry_date
          const today = new Date();
          const expiry = new Date(doc.expiry_date);
          const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

          let calculatedStatus = 'Active';
          if (diffDays < 0) calculatedStatus = 'Expired';
          else if (diffDays <= 30) calculatedStatus = 'Expiring Soon';

          console.log(diffDays);

          return {
            ...doc,
            // Mapping Supabase (snake_case) to your UI (camelCase)
            issueDate: doc.issue_date,
            expiryDate: doc.expiry_date,
            category: doc.categories?.name || 'General',
            status: calculatedStatus,
            // Responsible name can be hardcoded or fetched from a 'users' table later
            responsibleName: 'Admin User',
            responsibleInitials: 'AU',
          };
        });

        setPermits(formattedData);
      }
    } catch (error) {
      console.error('Error fetching permits:', error.message);
      toast.error('Failed to load permits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const filteredDocs = permits.filter((doc) => {
    const matchesFilter =
      activeFilter === 'all' ||
      doc.status.toLowerCase().replace(' ', '-') === activeFilter.toLowerCase();

    // Access the joined category name safely
    const categoryName = doc.categories?.name || 'Uncategorized';

    const searchTarget =
      `${doc.name} ${categoryName} ${doc.responsibleName}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const paginatedDocs = filteredDocs.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

  console.log(paginatedDocs);
  console.log(permits);

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

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-slate-500 font-medium">
                  Fetching your documents...
                </p>
              </div>
            ) : filteredDocs.length > 0 ? (
              <RepositoryTable documents={paginatedDocs} />
            ) : (
              /* The Empty State for your Graphic Design skills */
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Icon
                  icon="solar:folder-empty-bold-duotone"
                  className="mx-auto text-slate-300"
                  fontSize={64}
                />
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  No permits found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search or upload a new permit.
                </p>
              </div>
            )}

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
