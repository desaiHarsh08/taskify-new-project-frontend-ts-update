import TaskPrototype from "@/lib/task-prototype";
import { API } from "@/utils/api";

export const fetchTaskPrototypeById = async (taskPrototypeId: number): Promise<TaskPrototype> => {
    const response = await API.get(`/api/task-prototypes/${taskPrototypeId}`);
    return response.data;
}