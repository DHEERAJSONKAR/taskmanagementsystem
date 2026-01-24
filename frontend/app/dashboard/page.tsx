'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { taskService, Task } from '@/services/task.service';
import TaskItem from '@/components/TaskItem';
import TaskModal from '@/components/TaskModal';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchTasks();
  }, [page, filter, search]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      
      if (filter === 'completed') params.completed = 'true';
      if (filter === 'pending') params.completed = 'false';
      if (search) params.search = search;

      const { tasks: fetchedTasks, pagination } = await taskService.getTasks(params);
      setTasks(fetchedTasks);
      setTotalPages(pagination.totalPages);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      await taskService.createTask(data);
      toast.success('Task created successfully');
      fetchTasks();
    } catch (error: any) {
      toast.error('Failed to create task');
      throw error;
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;
    try {
      await taskService.updateTask(editingTask.id, data);
      toast.success('Task updated successfully');
      setEditingTask(null);
      fetchTasks();
    } catch (error: any) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      await taskService.toggleTask(id);
      toast.success('Task status updated');
      fetchTasks();
    } catch (error: any) {
      toast.error('Failed to toggle task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error: any) {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Fixed */}
      <header className="bg-white shadow flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
              {user && (
                <p className="text-sm text-gray-600 mt-1">
                  Welcome, <span className="font-semibold">{user.name}</span> ({user.email})
                </p>
              )}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-0 z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilter('all');
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setFilter('pending');
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'pending'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => {
                    setFilter('completed');
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'completed'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition whitespace-nowrap"
              >
                + New Task
              </button>
            </div>
          </div>

          {/* Tasks List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No tasks found</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onEdit={handleEdit}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  );
}
