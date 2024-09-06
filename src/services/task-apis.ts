import { MonthlyStats } from "@/lib/monthly-stats";
import { PageResponse } from "@/lib/page-response";
import Task from "@/lib/task";
import TaskPrototype from "@/lib/task-prototype";
import { TaskStats } from "@/lib/task-stats";
import { API } from "@/utils/api";

export const fetchTaskPrototypes = async (page: number): Promise<PageResponse<TaskPrototype>> => {
    const response = await API.get(`/api/task-prototypes?page=${page}`);
    return response.data;
}

export const createTask = async (newTask: Task): Promise<Task> => {
    const response = await API.post(`/api/tasks`, newTask);
    return response.data;
}

export const fetchAllTasks = async (page: number): Promise<PageResponse<Task>> => {
    const response = await API.get(`/api/tasks?page=${page}`);
    return response.data;
}

export const fetchStats = async (): Promise<TaskStats> => {
    const response = await API.get(`/api/tasks/stats`);
    return response.data;
}

export const fetchMonthlyStats = async (): Promise<MonthlyStats> => {
    const response = await API.get(`/api/tasks/monthly-stats`);
    return response.data;
}

export const fetchTaskById = async (taskId: number): Promise<Task> => {
    console.log("fetching taskId:", taskId);
    const response = await API.get(`/api/tasks/${taskId}`);
    console.log(response);
    return response.data;
}

export const deleteTask = async (taskId: number): Promise<Task> => {
    const response = await API.delete(`/api/tasks/${taskId}`);
    return response.data;
}

export const doCloseTask = async (task: Task): Promise<Task> => {
    const response = await API.post(`/api/tasks/do-close`, task);
    return response.data;
}

export const updateTask = async (task: Task, userId: number): Promise<Task> => {
    const response = await API.put(`/api/tasks/${task.id}?userId=${userId}`, task);
    return response.data;
}

export const fetchTaskByAbbreviation = async (taskAbbreviation: string): Promise<Task> => {
    const response = await API.get(`/api/tasks/abbreviation/${taskAbbreviation}`);
    console.log(response);
    return response.data;
}