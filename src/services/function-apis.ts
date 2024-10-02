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

export const fetchFile = async (filePath: string): Promise<Blob> => {
    const response = await API.get(`/api/functions/get-files?filePath=${filePath}`, {
        responseType: 'blob'
    });
    console.log("Fetched File Data:", response.data);
    return new Blob([response.data]);
}

export const updateFunction = async (fn: TFunction, userId: number): Promise<TFunction> => {
    const response = await API.put(`/api/functions/${fn.id}?userId=${userId}`, fn);
    return response.data;
}

export const uploadFiles = async (fn: TFunction, files: File[]): Promise<boolean> => {
    console.log("uploading fn files")
    if (!files) {
        throw Error("Unable to upload file(s)");
    }
    const formData = new FormData();
    // Append the column data as a JSON string
    formData.append('function', new Blob([JSON.stringify(fn)], { type: 'application/json' }));
    // Append each file to the FormData object
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    console.log("goinh to api");
    // Use axios or another method to send the form data
    const response = await API.post(`/api/functions/upload-files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    console.log("response.data:", response.data);

    return response.data;
}