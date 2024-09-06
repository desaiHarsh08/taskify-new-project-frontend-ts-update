import { Customer } from "./customer";

export interface ParentCompany {
    id?: number;
    companyName: string;
    address: string;
    state: string;
    city: string;
    pincode: string;
    headOfficeAddress: string;
    personOfContact: string;
    phone: string;
    businessType: string;
    remarks?: string;
    customers?: Customer[]
}