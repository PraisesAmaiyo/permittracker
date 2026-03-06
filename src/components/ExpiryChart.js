'use client';
import { Icon } from '@iconify/react';
import mockData from '@/data/mockDashboard.json';

export default function ExpiryChart() {
  const chartData = getRollingSixMonths(mockData.monthlyExpirations);

  const startMonth = chartData[0]?.month;
  const endMonth = chartData[chartData.length - 1]?.month;

  return (
    <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-lg font-bold">Permit Expiry Timeline</h3>
          <p className="text-sm text-slate-500">
            Projection for next 6 months ({startMonth} - {endMonth})
          </p>
        </div>
        {/* <button className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
          Next 6 Months
        </button> */}
      </div>

      <div className="flex items-end justify-between gap-4 h-84 px-2">
        {chartData.map((item, index) => {
          // Color Logic
          let barColor = 'bg-primary';
          if (item.value >= 80) barColor = 'bg-danger';
          else if (item.value >= 50) barColor = 'bg-warning';

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center h-full group relative"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap">
                {item.value} Expirations
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-t-xl flex-1 relative flex items-end overflow-hidden">
                <div
                  style={{ height: `${item.value}%` }}
                  className={`w-full transition-all duration-1000 ease-out rounded-t-lg ${barColor} group-hover:brightness-110`}
                />
              </div>
              <span className="mt-3 text-xs font-semibold text-slate-500">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Critical Expiries Section */}
      {/* <div className="mt-8 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Critical Expiries in March
        </h4>
        <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-between border border-red-100 dark:border-red-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <Icon icon="solar:danger-bold" />
            </div>
            <div>
              <p className="text-sm font-bold">Offshore Drilling Rig #4</p>
              <p className="text-[10px] text-slate-500">
                EPA Compliance • Expiring Mar 12
              </p>
            </div>
          </div>
          <button className="text-primary text-xs font-bold hover:underline">
            Renew
          </button>
        </div>
      </div> */}
    </div>
  );
}

const getRollingSixMonths = (allData) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const currentMonthIdx = new Date().getMonth(); // e.g., 2 for March

  // Create a rolling window
  let rollingData = [];
  for (let i = 0; i < 6; i++) {
    const targetIdx = (currentMonthIdx + i) % 12;
    const monthName = monthNames[targetIdx];
    const dataPoint = allData.find((d) => d.month === monthName);
    rollingData.push(dataPoint);
  }
  return rollingData;
};
