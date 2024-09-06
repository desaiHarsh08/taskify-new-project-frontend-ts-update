import { PageResponse } from "@/lib/page-response";
import { TaskifyTimeline } from "@/lib/taskify-timeline";
import { API } from "@/utils/api";

export const fetchTaskifyLogs = async (page: number, date: string): Promise<PageResponse<TaskifyTimeline>> => {
    const response = await API.get(`/api/taskify-timelines/date?page=${page}&date=${date}`);
    return response.data;
}