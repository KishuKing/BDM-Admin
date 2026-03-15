import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <span className="material-symbols-outlined">dashboard</span> },
    { name: 'Doctors', path: '/doctors', icon: <span className="material-symbols-outlined text-slate-400">person_search</span> },
    { name: 'Vendors', path: '/vendors', icon: <span className="material-symbols-outlined text-slate-400">storefront</span> },
    { name: 'Approved', path: '/users/approved', icon: <span className="material-symbols-outlined text-slate-400">how_to_reg</span> },
    { name: 'Analytics', path: '/analytics', icon: <span className="material-symbols-outlined text-slate-400">assessment</span> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
          <span className="material-symbols-outlined">health_and_safety</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold leading-none tracking-tight">MedAdmin</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Verification Portal</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium group ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors font-medium"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
