import { PageResponse } from "@/lib/page-response";
import { TaskifyTimeline } from "@/lib/taskify-timeline";
import { API } from "@/utils/api";

export const fetchTaskifyLogs = async (page: number, date: string): Promise<PageResponse<TaskifyTimeline>> => {
    const response = await API.get(`/api/taskify-timelines/date?page=${page}&date=${date}`);
    return response.data;
}

export const fetchTaskifyLogsByMonthAndYear = async (page: number, month: number, year: number): Promise<PageResponse<TaskifyTimeline>> => {
    const response = await API.get(`/api/taskify-timelines/filters?page=${page}&month=${month}&year=${year}`);
    return response.data;
}