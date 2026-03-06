'use client';
import ComplianceStatus from '@/components/ComplianceStatus';
import ExpiryChart from '@/components/ExpiryChart';
import RecentDocuments from '@/components/RecentDocuments';
import Sidebar from '@/components/Sidebar';
import { useNotifications } from '@/context/NotificationContext';
import mockData from '@/data/mockDashboard.json';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { hasNotification } = useNotifications();

  const { avatar, firstName, lastName } = mockData.user;

  const complianceData = { compliant: 40, pending: 5, nonCompliant: 3 };

  return (
    <div className="flex min-h-screen">
      {/* Pass the state to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 lg:ml-72 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            <Icon icon="solar:hamburger-menu-bold" fontSize={24} />
          </button>

          <h2 className="text-xl font-bold">Dashboard Overview</h2>
          <div className="flex gap-4">
            <SearchBar placeholder="Search permits, IDs..." />
            <HeaderNotificationBellAndLightModeToggle
              hasNotification={hasNotification}
            />
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {firstName}</h1>
              <p className="text-slate-500">
                Here is your compliance status for Q1 2026.
              </p>
            </div>

            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
              <Icon icon="solar:add-circle-bold" /> New Permit
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {mockData.stats.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={stat.value}
                trend={stat.trend}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          {/* More sections (Charts/Tables) will go here */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ComplianceStatus data={complianceData} />
            </div>
            <div className="lg:col-span-2">
              <ExpiryChart />
            </div>
          </div>

          {/* Row 3: Documents Table */}
          <RecentDocuments />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, trend, icon, color = 'blue' }) {
  const isPositive = trend.startsWith('+');

  // 1. Logic for Trend Badge Colors
  const getTrendStyles = () => {
    const isBadNews =
      label.toLowerCase().includes('expired') ||
      label.toLowerCase().includes('soon');

    // Using the semantic names from your @theme in globals.css
    if (isPositive) {
      return isBadNews
        ? 'text-danger bg-danger/10'
        : 'text-success bg-success/10';
    } else {
      return isBadNews
        ? 'text-success bg-success/10'
        : 'text-danger bg-danger/10';
    }
  };

  // 2. Mapping for Card Branding Colors
  const colorMap = {
    blue: {
      border: 'bg-primary/20',
      hover: 'group-hover:bg-primary',
      icon: 'text-primary bg-primary/10',
    },
    green: {
      border: 'bg-success/20',
      hover: 'group-hover:bg-success',
      icon: 'text-success bg-success/10',
    },
    orange: {
      border: 'bg-warning/20',
      hover: 'group-hover:bg-warning',
      icon: 'text-warning bg-warning/10',
    },
    red: {
      border: 'bg-danger/20',
      hover: 'group-hover:bg-danger',
      icon: 'text-danger bg-danger/10',
    },
  };

  const selected = colorMap[color] || colorMap.blue;
  const trendClass = getTrendStyles();

  return (
    <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-40 relative overflow-hidden group transition-all hover:shadow-md">
      {/* Side Accent Line */}
      <div
        className={`absolute right-0 top-0 h-full w-1 ${selected.border} ${selected.hover} transition-colors`}
      />

      <div className="flex justify-between items-start">
        {/* Icon with Dynamic Background and Color */}
        <div
          className={`p-2 rounded-lg flex items-center justify-center ${selected.icon}`}
        >
          <Icon icon={icon} fontSize={24} />
        </div>

        {/* Trend Badge */}
        <span
          className={`flex items-center px-2 py-0.5 rounded text-xs font-bold ${trendClass}`}
        >
          <Icon
            icon={
              isPositive ? 'solar:course-up-bold' : 'solar:course-down-bold'
            }
            className="mr-1"
          />
          {trend}
        </span>
      </div>

      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {label}
        </p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}

function SearchBar({ placeholder }) {
  return (
    <div className="hidden md:flex relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none cursor-pointer">
        <Icon className="cursor-pointer" icon="solar:magnifer-linear" />
      </div>
      <input
        className="block w-64 pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition duration-150 ease-in-out sm:text-sm"
        placeholder={placeholder || 'Input search item here'}
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
