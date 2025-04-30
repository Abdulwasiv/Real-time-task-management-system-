import axios from 'axios';
import { LoginDetails, RegisterDetails, TaskData } from '../utils/interfaces';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // for sending JWT cookie
});

// No Authorization header needed; backend uses cookie auth

export const registerUser = async (userData: RegisterDetails) => {
  try {
    const res = await apiClient.post('/user/register', userData);
    console.log(res,"--const")
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Registration failed');
  }
};

export const loginUser = async (userData: LoginDetails) => {
  try {
    const res = await apiClient.post('/user/login', userData);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    const res = await apiClient.put('/user/logout');
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Logout failed');
  }
};

export const deleteUser = async () => {
  try {
    const res = await apiClient.delete('/user/delete');
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'User deletion failed');
  }
};

export const createTask = async (taskData: TaskData) => {
  try {
    const res = await apiClient.post('/task/create', taskData);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Task creation failed');
  }
};

export const getTasks = async () => {
  try {
    const res = await apiClient.get('/task/');
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Failed to get tasks');
  }
};

export const updateTask = async (taskId: string, taskData: Partial<TaskData>) => {
  try {
    const res = await apiClient.put(`/task/update?task_id=${taskId}`, taskData);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Task update failed');
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const res = await apiClient.delete(`/task/delete?task_id=${taskId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Task deletion failed');
  }
};

export const assignTask = async (taskData: TaskData) => {
  try {
    const res = await apiClient.post('/task/assign', taskData);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Task assignment failed');
  }
};

export const getSuggestions = async () => {
  try {
    const res = await apiClient.get('/task/suggestions');
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Failed to get suggestions');
  }
};

export const breakdownTask = async (taskId: string) => {
  try {
    const res = await apiClient.post(`/task/breakdown/${taskId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Failed to breakdown task');
  }
};