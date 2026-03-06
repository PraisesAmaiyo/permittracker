'use client';
import { Icon } from '@iconify/react';
import mockData from '@/data/mockDashboard.json';
import { useNotifications } from '@/context/NotificationContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { unreadCount } = useNotifications();
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
    fixed flex flex-col h-full z-40 w-72 bg-white dark:bg-[#1a202c] border-r border-slate-200 
    transition-transform duration-300 lg:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute right-4 top-6 text-slate-500"
        >
          <Icon icon="solar:close-circle-bold" fontSize={24} />
        </button>

        <Logo />

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon="solar:widget-bold" label="Dashboard" page="" active />
          <NavItem
            icon="solar:document-bold"
            label="Documents"
            page="documents"
          />
          <NavItem icon="solar:chart-bold" label="Reports" page="reports" />
          <NavItem
            icon="solar:bell-bing-bold"
            label="Notifications"
            badge={unreadCount > 0 ? unreadCount : null}
            page="notifications"
          />
        </nav>

        <SidebarUserProfile />
      </aside>
    </>
  );
}

function SidebarUserProfile() {
  const { avatar, firstName, lastName } = mockData.user;
  return (
    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a202c]">
      <div className="flex items-center gap-3 px-2 py-2">
        <img
          src={avatar}
          alt={`${firstName} ${lastName}`}
          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          /* Adding an onError helps you debug if the path is still wrong */
          onError={(e) => {
            e.target.src = 'https://ui-avatars.com/api/?name=PA';
          }}
        />
        <div className="flex flex-col">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {mockData.user.firstName} {mockData.user.lastName}
          </p>
          <p className="text-xs text-slate-500">Compliance Lead</p>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, badge, page }) {
  const pathname = usePathname();

  // Logic:
  // If page is "" (Dashboard), it matches exact "/"
  // Otherwise, check if current path starts with the page name
  const isActive =
    page === '' ? pathname === '/' : pathname.startsWith(`/${page}`);

  return (
    <Link
      href={page === '' ? '/' : `/${page}`}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive
          ? 'bg-primary/10 dark:bg-primary/20 text-primary  dark:text-slate-50 font-bold border-r-4 border-primary'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon icon={icon} fontSize={22} />
      <p className="text-sm font-medium flex-1">{label}</p>
      {badge && (
        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3 p-6 border-b border-slate-100 dark:border-slate-800">
      <div className="bg-primary/10 rounded-lg p-2 flex items-center justify-center">
        <Icon
          icon="solar:shield-check-bold"
          className="text-primary text-2xl"
        />
      </div>
      <div>
        <h1 className="text-slate-900 dark:text-white text-lg font-bold">
          PermitTracker
        </h1>
        <p className="text-slate-500 text-xs">Enterprise Compliance</p>
      </div>
    </div>
  );
}
