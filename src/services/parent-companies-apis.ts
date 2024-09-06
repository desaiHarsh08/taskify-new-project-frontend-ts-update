import { PageResponse } from "@/lib/page-response";
import { ParentCompany } from "@/lib/parent-company";
import { API } from "@/utils/api";

export const fetchParentCompanies = async (page: number): Promise<PageResponse<ParentCompany>> => {
    const response = await API.get(`/api/parent-companies?page=${page}`);
    console.log(response)
    return response.data;
}

export const fetchParentCompaniesList = async (): Promise<ParentCompany[]> => {
    const response = await API.get(`/api/parent-companies/list`);
    console.log(response)
    return response.data;
}

export const createParentCompany = async (parentCompany: ParentCompany): Promise<PageResponse<ParentCompany>> => {
    const response = await API.post(`/api/parent-companies`, parentCompany);
    console.log(response)
    return response.data;
}