'use client';
import ComplianceStatus from '@/components/ComplianceStatus';
import ExpiryChart from '@/components/ExpiryChart';
import RecentDocuments from '@/components/RecentDocuments';
import Sidebar from '@/components/Sidebar';
import { useNotifications } from '@/context/NotificationContext';
import mockData from '@/data/mockDashboard.json';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import IntroHeading from '@/components/IntroHeading';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { avatar, firstName, lastName } = mockData.user;

  const complianceData = { compliant: 40, pending: 5, nonCompliant: 3 };

  return (
    <div className="flex min-h-screen">
      {/* Pass the state to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 lg:ml-72 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          headerName="Dashboard Overview"
          onOpenSidebar={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Content */}
        <div className="p-4 md:p-8 space-y-8 overflow-y-auto overflow-x-hidden">
          <IntroHeading
            title={`Welcome back, ${firstName}`}
            subText={'Here is your compliance status for Q1 2026.'}
          />

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
                filterType={stat.filterType}
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

function StatCard({ label, value, trend, icon, color = 'blue', filterType }) {
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
    <Link
      href={`/documents?filter=${filterType}`}
      className="bg-white dark:bg-[#1a202c] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-40 relative overflow-hidden group transition-all hover:shadow-md"
    >
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
    </Link>
  );
}
