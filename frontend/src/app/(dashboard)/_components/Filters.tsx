'use client';

import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  completed: string;
  setCompleted: (value: string) => void;
  onFilter: () => void;
}

export default function Filters({
  search,
  setSearch,
  completed,
  setCompleted,
  onFilter,
}: FiltersProps) {
  const debounced = useDebouncedCallback(() => {
    onFilter();
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounced();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompleted(e.target.value);
    onFilter();
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md md:flex-row md:items-center">
      <div className="relative flex-grow">
        <Search className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" size={20} />
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
          className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex-shrink-0">
        <select
          value={completed}
          onChange={handleStatusChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md md:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>
      </div>
    </div>
  );
}
