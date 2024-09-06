import { TFunction } from "@/lib/task";
import { API } from "@/utils/api";

export const createFunction = async (newFunction: TFunction): Promise<TFunction> => {
    const response = await API.post(`/api/functions`, newFunction);

    return response.data;
}

export const fetchFunctionById = async (functionId: number): Promise<TFunction> => {
    const response = await API.get(`/api/functions/${functionId}`);
    return response.data;
}

export const doCloseFunction = async (fn: TFunction, functionId: number, userId: number): Promise<TFunction> => {
    const response = await API.put(`/api/functions/do-close/${functionId}?userId=${userId}`, fn);
    return response.data;
}