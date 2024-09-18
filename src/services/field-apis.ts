import { Field } from "@/lib/task";
import { API } from "@/utils/api";

export const createField = async (field: Field): Promise<Field> => {
    const response = await API.post(`/api/fields`, field);
    return response.data;
}

export const closeField = async (field: Field, userId: number): Promise<Field> => {
    const response = await API.put(`/api/fields/close?userId=${userId}`, field);
    return response.data;
}

export const deleteField = async (fieldId: number): Promise<Field> => {
    const response = await API.delete(`/api/fields/${fieldId}`);
    return response.data;
}