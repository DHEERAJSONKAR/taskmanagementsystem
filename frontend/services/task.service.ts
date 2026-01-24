import api from '../lib/api';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  completed?: 'true' | 'false';
  search?: string;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const taskService = {
  async getTasks(params?: GetTasksParams): Promise<TasksResponse> {
    const response = await api.get('/tasks', { params });
    return {
      tasks: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await api.post('/tasks', data);
    return response.data.data;
  },

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTask(id: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data.data;
  },
};
