
import { ColumnPrototype } from "@/lib/task-prototype";
import { API } from "@/utils/api";

export const fetchColumnPrototypeById = async (columnPrototypeId: number): Promise<ColumnPrototype> => {
    const response = await API.get(`/api/column-prototypes/${columnPrototypeId}`);
    return response.data;
}
