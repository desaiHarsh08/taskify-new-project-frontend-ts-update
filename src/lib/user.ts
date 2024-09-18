import Department from "./department-type";
import RoleType from "./role-type";

export interface Role {
    id?: number;
    userId?: number;
    roleType: RoleType;
}

export default interface User {
    id?: number | null | undefined;
    name: string;
    email: string;
    password?: string;
    phone: string;
    isDisabled: boolean;
    department: Department;
    roles: Role[]
}
