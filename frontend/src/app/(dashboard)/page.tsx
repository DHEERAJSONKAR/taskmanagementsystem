'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Task } from '@/types';
import toast from 'react-hot-toast';
import TaskItem from './_components/TaskItem';
import AddTask from './_components/AddTask';
import EditTaskModal from './_components/EditTaskModal';
import Filters from './_components/Filters';
import Pagination from './_components/Pagination';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  // Filters and Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState<string>(''); // 'true', 'false', or ''

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        search,
      });
      if (completed) {
        params.append('completed', completed);
      }

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data.data.tasks);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, search, completed]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskAdded = (newTask: Task) => {
    setShowAddTask(false);
    fetchTasks();
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleToggle = (toggledTask: Task) => {
    setTasks(tasks.map((t) => (t.id === toggledTask.id ? toggledTask : t)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Tasks</h2>
          <p className="text-gray-500">Here's what you have for today.</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white transition-all duration-300 bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {showAddTask && <AddTask onTaskAdded={handleTaskAdded} onCancel={() => setShowAddTask(false)} />}

      <div className="p-4 bg-white rounded-xl shadow-sm sm:p-6">
        <Filters
          search={search}
          setSearch={setSearch}
          completed={completed}
          setCompleted={setCompleted}
          onFilter={() => setPage(1)}
        />

        <div className="mt-6">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading tasks...</p>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={() => setEditingTask(task)}
                  onDelete={handleTaskDeleted}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <h3 className="text-lg font-semibold text-gray-700">No tasks found</h3>
              <p className="text-gray-500">
                Click "Add New Task" to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}
