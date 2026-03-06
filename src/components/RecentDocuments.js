'use client';
import mockData from '@/data/mockDashboard.json';
import { Icon } from '@iconify/react';

const statusStyles = {
  Approved:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Pending Review':
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Archived: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

export default function RecentDocuments({ documents = [] }) {
  const { recentDocuments } = mockData.recentDocuments;

  return (
    <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-bold">Recent Documents</h3>
        <button className="text-primary text-sm font-semibold hover:underline">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-6 py-3 font-bold">Document Name</th>
              <th className="px-6 py-3 font-bold">Type/Category</th>
              <th className="px-6 py-3 font-bold">Date Uploaded</th>
              <th className="px-6 py-3 font-bold">Expiry</th>
              <th className="px-6 py-3 font-bold">Status</th>
              <th className="px-6 py-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockData.recentDocuments.map((doc) => {
              const { icon, color } = getFileIcon(doc.name);

              console.log(icon, color);
              return (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Icon icon={icon} className={color} fontSize={20} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {doc.dateUploaded}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {doc.expiry}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-bold ${statusStyles[doc.status]}`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <Icon
                        icon="solar:download-minimalistic-bold"
                        fontSize={18}
                      />
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

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return { icon: 'solar:file-download-bold', color: 'text-red-500' };
    case 'doc':
    case 'docx':
      return { icon: 'solar:document-bold', color: 'text-blue-500' };
    case 'xls':
    case 'xlsx':
    case 'csv':
      return {
        icon: 'solar:checklist-minimalistic-bold',
        color: 'text-green-600',
      };
    case 'jpg':
    case 'png':
    case 'img':
      return { icon: 'solar:gallery-bold', color: 'text-purple-500' };
    default:
      return { icon: 'solar:file-text-bold', color: 'text-slate-400' };
  }
};
