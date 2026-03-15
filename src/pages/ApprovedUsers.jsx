import React, { useEffect, useState } from 'react';
import VerificationTable from '../components/VerificationTable';
import { getApprovedUsers } from '../services/api';

const ApprovedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedUsers();
  }, []);

  const fetchApprovedUsers = async () => {
    try {
      const data = await getApprovedUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch approved users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Approved Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View all doctors and vendors currently approved</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      ) : (
        <VerificationTable data={users} type="approved" />
      )}
    </div>
  );
};

export default ApprovedUsers;
