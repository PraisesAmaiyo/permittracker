import { Icon } from '@iconify/react';
import { getFileIcon } from '@/utils/fileHelpers';
import { useRouter } from 'next/navigation';

const statusStyles = {
  Active:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Expiring Soon':
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Archived: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

export default function RepositoryTable({ documents }) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 font-bold sticky left-0 bg-slate-50 dark:bg-[#1a202c] z-10">
                Document Name
              </th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Responsible Person</th>
              <th className="px-6 py-4 font-bold">Expiry Date</th>
              <th className="px-6 py-4 font-bold text-center">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {documents.map((doc) => {
              const { icon, color } = getFileIcon(doc.name);
              return (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    router.push(`/documents/${doc.id}`);
                  }}
                >
                  {/* Sticky Name Column */}
                  <td className="px-6 py-4 sticky left-0 bg-white dark:bg-[#1a202c] group-hover:bg-slate-50 dark:group-hover:bg-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3">
                      <Icon icon={icon} className={color} fontSize={22} />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {doc.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 ">
                    {doc.category}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center text-[10px] font-bold text-primary dark:text-slate-50 border border-primary/20">
                        {doc.responsibleInitials}
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {doc.responsibleName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">
                    {doc.expiryDate}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusStyles[doc.status]}`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                      <Icon icon="solar:menu-dots-bold" fontSize={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
