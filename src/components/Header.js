'use client';
import mockData from '@/data/mockDashboard.json';
import { Icon } from '@iconify/react';
import { useNotifications } from '@/context/NotificationContext';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getFileIcon } from '@/utils/fileHelpers';
import { useRouter } from 'next/navigation';
import DocumentDetail from '@/app/documents/[id]/page';
import { usePathname } from 'next/navigation';

export default function Header({
  headerName,
  onOpenSidebar,
  searchQuery,
  setSearchQuery,
}) {
  const { hasNotification } = useNotifications();

  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // If typing and on the right page, filter results
    if (pathname === '/' && query.length > 1) {
      const filtered = mockData.allDocuments
        .filter((doc) => doc.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setResults(filtered);
      setShowDropdown(true);
    } else if (query.length <= 1) {
      // FIX: Instead of hiding the dropdown, we keep it true
      // so the SearchBar can show history instead of results.
      setResults([]);
      setShowDropdown(true);
    }
  };

  return (
    <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 sticky top-0 z-20 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* LEFT: Sidebar Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Icon icon="solar:hamburger-menu-bold" fontSize={24} />
          </button>
          {/* <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white truncate max-w-[150px] md:max-w-none">
            {headerName}
          </h2> */}
          <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white truncate max-w-37.5 md:max-w-none">
            {headerName}
          </h2>
        </div>

        {/* RIGHT: Search (Desktop) & Actions */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto lg:ml-0">
          <div className="hidden md:block">
            <SearchBar
              searchQuery={searchQuery}
              handleSearch={handleSearch}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              results={results}
              searchRef={searchRef}
              setSearchQuery={setSearchQuery}
            />
          </div>

          <HeaderNotificationBellAndLightModeToggle
            hasNotification={hasNotification}
          />
        </div>

        {/* BOTTOM: Search (Mobile Only) */}
        <div className="w-full md:hidden">
          <SearchBar
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            results={results}
            searchRef={searchRef}
            setSearchQuery={setSearchQuery}
            isMobile
          />
        </div>
      </div>
    </header>
  );
}

function SearchBar({
  searchQuery,
  handleSearch,
  showDropdown,
  setShowDropdown,
  results,
  searchRef,
  isMobile,
  setSearchQuery,
}) {
  const router = useRouter();
  const [history, setHistory] = useState([]);

  // Load history safely
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveToHistory = (query) => {
    const cleanQuery = query?.trim();
    if (!cleanQuery || cleanQuery.length < 2) return;

    setHistory((prev) => {
      const newHistory = [
        cleanQuery,
        ...prev.filter((i) => i !== cleanQuery),
      ].slice(0, 3);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const deleteHistoryItem = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((i) => i !== item);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const performSearch = (e, customQuery = null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const finalQuery = customQuery || searchQuery;

    if (finalQuery?.trim().length > 0) {
      saveToHistory(finalQuery);
      const params = new URLSearchParams(window.location.search);
      params.set('search', finalQuery.trim());
      setShowDropdown(false);
      router.push(`/documents?${params.toString()}`);
    }
  };

  return (
    <div
      className={`relative group ${isMobile ? 'w-full' : 'w-80'}`}
      ref={searchRef}
    >
      <div className="relative">
        <input
          value={searchQuery || ''}
          onChange={handleSearch}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(e) => e.key === 'Enter' && performSearch(e)}
          className="block w-full pl-4 pr-12 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all dark:text-white text-sm"
          placeholder="Search documents..."
        />

        <button
          onMouseDown={(e) => performSearch(e)}
          disabled={!searchQuery?.trim()}
          className={`absolute right-3 inset-y-0 flex items-center transition-colors ${
            searchQuery?.trim() ? 'text-primary' : 'text-slate-400'
          }`}
        >
          <Icon
            icon={
              searchQuery?.length > 0
                ? 'solar:rounded-magnifer-bold'
                : 'solar:magnifer-linear'
            }
            fontSize={22}
          />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* HISTORY VIEW: Input is empty or very short */}
          {!searchQuery || searchQuery.trim().length <= 1 ? (
            history.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Recent Searches
                </div>
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group/hist"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setSearchQuery(item);
                      performSearch(null, item);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="solar:history-linear"
                        className="text-slate-400"
                        fontSize={18}
                      />
                      <span className="text-sm dark:text-slate-200">
                        {item}
                      </span>
                    </div>
                    <button
                      onMouseDown={(e) => deleteHistoryItem(e, item)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 rounded text-slate-400 transition-colors"
                    >
                      <Icon icon="solar:close-circle-bold" fontSize={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null // Hide entirely if no history and no search
          ) : (
            /* RESULTS VIEW: User is typing */
            <>
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                Quick Matches
              </div>
              {results.length > 0 ? (
                <>
                  {results.map((doc) => {
                    const { icon, color } = getFileIcon(doc.name);
                    return (
                      <button
                        key={doc.id}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          saveToHistory(searchQuery);
                          setShowDropdown(false);
                          router.push(`/documents/${doc.id}`);
                        }}
                      >
                        <Icon icon={icon} className={color} fontSize={20} />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-semibold truncate dark:text-white">
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {doc.category}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                  <button
                    onMouseDown={(e) => performSearch(e)}
                    className="w-full block text-center py-3 text-xs font-bold text-primary hover:bg-primary/5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a202c]"
                  >
                    See all results for "{searchQuery}"
                  </button>
                </>
              ) : (
                <div className="p-4 text-center text-sm text-slate-500">
                  No matches found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
// function SearchBar({
//   searchQuery,
//   handleSearch,
//   showDropdown,
//   setShowDropdown,
//   results,
//   searchRef,
//   isMobile,
//   setSearchQuery,
// }) {
//   const router = useRouter();

//   // 1. Initialize state with a function to avoid the useEffect warning
//   const [history, setHistory] = useState([]);

//   // Load history safely after mount to avoid hydration mismatch
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]');
//     setHistory(saved);
//   }, []);

//   const saveToHistory = (query) => {
//     const cleanQuery = query?.trim();
//     if (!cleanQuery) return;

//     // Use functional update to ensure we have latest history
//     setHistory((prev) => {
//       const newHistory = [
//         cleanQuery,
//         ...prev.filter((i) => i !== cleanQuery),
//       ].slice(0, 3);
//       localStorage.setItem('searchHistory', JSON.stringify(newHistory));
//       return newHistory;
//     });
//   };

//   const deleteHistoryItem = (e, item) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setHistory((prev) => {
//       const updated = prev.filter((i) => i !== item);
//       localStorage.setItem('searchHistory', JSON.stringify(updated));
//       return updated;
//     });
//   };

//   // 2. Fixed the performSearch arguments
//   const performSearch = (e, customQuery = null) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }

//     // Use the query passed from history click OR the current state
//     const finalQuery = customQuery || searchQuery;

//     if (finalQuery?.trim().length > 0) {
//       saveToHistory(finalQuery);
//       const params = new URLSearchParams(window.location.search);
//       params.set('search', finalQuery.trim());
//       setShowDropdown(false);
//       router.push(`/documents?${params.toString()}`);
//     }
//   };

//   const handleHistoryClick = (item) => {
//     // Populate the input
//     setSearchQuery(item);
//     // Execute the search immediately with the clicked item
//     performSearch(null, item);
//   };

//   return (
//     <div
//       className={`relative group ${isMobile ? 'w-full' : 'w-80'}`}
//       ref={searchRef}
//     >
//       <div className="relative">
//         <input
//           value={searchQuery || ''}
//           onChange={handleSearch}
//           onFocus={() => searchQuery?.length > 1 && setShowDropdown(true)}
//           onKeyDown={(e) => e.key === 'Enter' && performSearch(e)}
//           className="block w-full pl-4 pr-12 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all dark:text-white"
//           placeholder="Search NUPRC, Tax, etc..."
//         />

//         {/* Use onMouseDown to beat the 'blur' event for 1-click routing */}
//         <button
//           onMouseDown={(e) => performSearch(e)}
//           disabled={!searchQuery?.trim()}
//           className={`absolute right-3 inset-y-0 flex items-center transition-colors ${
//             searchQuery?.trim() ? 'text-primary' : 'text-slate-400'
//           }`}
//         >
//           <Icon
//             icon={
//               searchQuery?.length > 0
//                 ? 'solar:rounded-magnifer-bold'
//                 : 'solar:magnifer-linear'
//             }
//             fontSize={22}
//           />
//         </button>
//       </div>

//       {showDropdown && (
//         <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
//           {/* FIX 2: Logic to show History vs Results */}
//           {!searchQuery || searchQuery.length <= 1 ? (
//             /* --- RECENT HISTORY SECTION --- */
//             history.length > 0 ? (
//               <div className="py-2">
//                 <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   Recent Searches
//                 </div>
//                 {history.map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group/item"
//                     onMouseDown={() => {
//                       setSearchQuery(item);
//                       performSearch(null, item);
//                     }}
//                   >
//                     <div className="flex items-center gap-3">
//                       <Icon
//                         icon="solar:history-linear"
//                         className="text-slate-400"
//                       />
//                       <span className="text-sm dark:text-white">{item}</span>
//                     </div>
//                     <button
//                       onMouseDown={(e) => deleteHistoryItem(e, item)}
//                       className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 transition-colors"
//                     >
//                       <Icon icon="solar:close-circle-bold" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="p-4 text-center text-xs text-slate-400 italic">
//                 No recent searches
//               </div>
//             )
//           ) : (
//             /* --- QUICK MATCHES SECTION --- */
//             <>
//               <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
//                 Quick Matches
//               </div>
//               {results.length > 0 ? (
//                 <>
//                   {results.map((doc) => {
//                     const { icon, color } = getFileIcon(doc.name);
//                     return (
//                       <button
//                         key={doc.id}
//                         className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
//                         onMouseDown={(e) => {
//                           e.preventDefault();
//                           saveToHistory(searchQuery);
//                           setShowDropdown(false);
//                           router.push(`/documents/${doc.id}`);
//                         }}
//                       >
//                         <Icon icon={icon} className={color} fontSize={20} />
//                         <div className="flex-1 overflow-hidden">
//                           <p className="text-sm font-semibold truncate dark:text-white">
//                             {doc.name}
//                           </p>
//                           <p className="text-[11px] text-slate-500">
//                             {doc.category}
//                           </p>
//                         </div>
//                       </button>
//                     );
//                   })}
//                   <button
//                     onMouseDown={(e) => performSearch(e)}
//                     className="w-full block text-center py-3 text-xs font-bold text-primary hover:bg-primary/5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a202c]"
//                   >
//                     See all results for "{searchQuery}"
//                   </button>
//                 </>
//               ) : (
//                 <div className="p-4 text-center text-sm text-slate-500">
//                   No matches found
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

function HeaderNotificationBellAndLightModeToggle({ hasNotification }) {
  // 1. Initialize state by checking the DOM immediately.
  // This function runs only once when the component is first created.
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // 2. The Toggle Function
  const toggleTheme = () => {
    const newDarkStatus = !isDark;
    setIsDark(newDarkStatus);

    if (newDarkStatus) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Notification Bell */}
      <button className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
        <Icon icon="solar:bell-bold" fontSize={20} />
        {hasNotification && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#1a202c]"></span>
        )}
      </button>

      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <Icon
          icon={isDark ? 'solar:sun-2-bold' : 'solar:moon-bold'}
          fontSize={20}
          className={isDark ? 'text-yellow-400' : 'text-slate-600'}
        />
      </button>
    </div>
  );
}

{
  /* {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
            Quick Matches
          </div>

          {results.length > 0 ? (
            <>
              {results.map((doc) => {
                const { icon, color } = getFileIcon(doc.name);

                return (
                  <button
                    key={doc.id}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowDropdown(false);
                      router.push(`/documents/${doc.id}`);
                    }}
                  >
                    <Icon icon={icon} className={color} fontSize={20} />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {doc.category}
                      </p>
                    </div>
                  </button>
                );
              })}

              <button
                onMouseDown={(e) => performSearch(e)}
                className="w-full block text-center py-3 text-xs font-bold text-primary hover:bg-primary/5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a202c]"
              >
                See all results for `{searchQuery}``
              </button>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              No matches found
            </div>
          )}
        </div>
      )} */
}
