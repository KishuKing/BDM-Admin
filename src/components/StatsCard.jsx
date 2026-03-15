import React from 'react';

const StatsCard = ({ title, value, valueColor = "text-slate-900 dark:text-white" }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <h3 className={`text-3xl font-bold ${valueColor}`}>{value}</h3>
    </div>
  );
};

export default StatsCard;
