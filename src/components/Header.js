'use client';
import mockData from '@/data/mockDashboard.json';
import { Icon } from '@iconify/react';
import { useNotifications } from '@/context/NotificationContext';
import { useState } from 'react';

export default function Header({
  headerName,
  onOpenSidebar,
  searchQuery,
  setSearchQuery,
}) {
  const { hasNotification } = useNotifications();

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <HeaderNotificationBellAndLightModeToggle
            hasNotification={hasNotification}
          />
        </div>

        {/* BOTTOM: Search (Mobile Only) */}
        <div className="w-full md:hidden">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            isMobile
          />
        </div>
      </div>
    </header>
  );
}

function SearchBar({ value, onChange, placeholder, isMobile }) {
  return (
    <div className={`relative group ${isMobile ? 'w-full' : 'w-64'}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon
          icon="solar:magnifer-linear"
          className="text-slate-400 group-focus-within:text-primary transition-colors"
        />
      </div>
      <input
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-xl leading-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary/30 transition-all sm:text-sm"
        placeholder={placeholder || 'Search documents...'}
        type="text"
      />
    </div>
  );
}
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
