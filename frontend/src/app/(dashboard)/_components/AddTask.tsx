'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Task } from '@/types';
import toast from 'react-hot-toast';

interface AddTaskProps {
  onTaskAdded: (task: Task) => void;
  onCancel: () => void;
}

export default function AddTask({ onTaskAdded, onCancel }: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/tasks', { title, description });
      toast.success('Task added successfully!');
      onTaskAdded(response.data.data);
      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Add a New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Task Title (e.g., Finish project report)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Add a description... (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          ></textarea>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
