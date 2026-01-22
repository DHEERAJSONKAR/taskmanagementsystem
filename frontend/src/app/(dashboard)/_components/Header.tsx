'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, ListChecks } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 shadow-sm backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-2">
          <ListChecks className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-600 sm:block">
            Welcome, {user?.name}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-red-100 hover:text-red-600"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
