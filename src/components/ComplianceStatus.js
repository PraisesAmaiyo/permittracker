'use client';
import mockData from '@/data/mockDashboard.json';

export default function ComplianceStatus() {
  const { percentage, stats } = mockData.compliance;

  // SVG Math
  const radius = 100;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // 3-Color Logic for the Ring
  let strokeColor = '#0a47c2'; // Default Primary
  if (percentage < 50)
    strokeColor = '#dc2626'; // Danger
  else if (percentage < 80) strokeColor = '#ea580c'; // Warning

  return (
    <div className="bg-white dark:bg-[#1a202c] rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center h-full">
      <div className="flex justify-between w-full mb-8">
        <h3 className="text-lg font-bold">Compliance Status</h3>
        <button className="text-slate-400 hover:text-slate-600">•••</button>
      </div>

      <div className="relative inline-flex items-center justify-center mb-8">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-black">{percentage}%</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            Overall
          </span>
        </div>
      </div>

      <div className="w-full space-y-4">
        {stats.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Note: We use the hex-mapped tailwind colors here */}
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function LegendItem({ color, label, count }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold">{count}</span>
    </div>
  );
}
