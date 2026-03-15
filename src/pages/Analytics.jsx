import React from 'react';
import Dashboard from './Dashboard';

const Analytics = () => {
  // We can reuse the Dashboard view for now, as it contains all the stats and charts
  // In a full production app, this page would contain more detailed filtering/reports
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detailed Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Comprehensive view of verification metrics</p>
      </div>
      <Dashboard />
    </div>
  );
};

export default Analytics;
