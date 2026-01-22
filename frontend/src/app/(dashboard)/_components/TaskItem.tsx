'use client';

import { Task } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: (taskId: string) => void;
  onToggle: (task: Task) => void;
}

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggle,
}: TaskItemProps) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${task.id}`);
        toast.success('Task deleted');
        onDelete(task.id);
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggle = async () => {
    try {
      const response = await api.patch(`/tasks/${task.id}/toggle`);
      toast.success(`Task marked as ${response.data.data.completed ? 'complete' : 'pending'}`);
      onToggle(response.data.data);
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  return (
    <div className="flex items-center p-4 transition-all duration-200 bg-white border border-transparent rounded-lg hover:shadow-md hover:border-gray-200">
      <div className="flex items-center flex-grow gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="w-5 h-5 text-indigo-600 transition-colors border-gray-300 rounded-full focus:ring-indigo-500 focus:ring-offset-0"
        />
        <div className="flex-grow">
          <h3
            className={`font-medium text-gray-800 ${
              task.completed ? 'line-through text-gray-400' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-sm text-gray-500 ${
                task.completed ? 'line-through' : ''
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 ml-4">
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-indigo-600"
          aria-label="Edit task"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 transition-colors rounded-full hover:bg-red-100 hover:text-red-600"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
