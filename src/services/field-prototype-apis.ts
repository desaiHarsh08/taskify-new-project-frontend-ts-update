import { FieldPrototype } from "@/lib/task-prototype";
import { API } from "@/utils/api";

export const fetchFieldPrototypeById = async (fieldPrototypeId: number): Promise<FieldPrototype> => {
    const response = await API.get(`/api/field-prototypes/${fieldPrototypeId}`);
    return response.data;
}