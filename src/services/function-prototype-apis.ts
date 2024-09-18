import { FunctionPrototype } from "@/lib/task-prototype";
import { API } from "@/utils/api";

export const fetchFunctionPrototypeById = async (id: number): Promise<FunctionPrototype> => {
    const response = await API.get(`/api/function-prototypes/${id}`);
    return response.data;
}