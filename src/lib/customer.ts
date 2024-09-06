export interface Customer {
    id?: number | null;
    customerName: string;
    email?: string | null;
    personOfContact: string;
    phone: string;
    state: string;
    birthDate?: Date;
    anniversary?: Date;
    address: string;
    residenceAddress: string;
    city: string;
    pincode: string;
    parentCompanyId: number | null;

}