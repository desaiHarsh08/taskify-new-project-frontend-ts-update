import DepartmentType from "./department-type";
import PriorityType from "./priority-type";

export interface Column {
    id?: number;
    columnPrototypeId: number | null | undefined;
    createdByUserId: number | null | undefined;
    fieldId?: number | null | undefined;
    numberValue: number | null;
    textValue: string | null;
    dateValue: string | null;
    booleanValue: boolean | null;
    fileDirectoryPaths?: string[];
    multipartFiles?: File[] | null
}

export interface Field {
    id?: number;
    fieldPrototypeId: number | null;
    functionId?: number | null | undefined;
    createdByUserId: number | null | undefined;
    createdDate?: Date | string;
    closedByUserId?: number | null | undefined;
    closedDate?: Date | null;
    isClosed?: boolean;
    lastEdited?: Date | null;
    columns: Column[];
}

export interface TFunction {
    id?: number;
    functionPrototypeId: number | null | undefined;
    taskId: number | null | undefined;
    department: DepartmentType;
    createdByUserId: number | null | undefined;
    createdDate?: Date | string;
    dueDate: Date | string;
    closedByUserId?: number | null | undefined;
    closedDate?: Date | null;
    isClosed?: boolean;
    fields: Field[];
}

export default interface Task {
    id?: number;
    taskPrototypeId: number | null | undefined;
    priorityType: PriorityType;
    createdByUserId: number | null | undefined;
    assignedToUserId: number | null | undefined;
    createdDate?: Date | string;
    closedByUserId?: number | null;
    closedDate?: Date | null;
    isClosed?: boolean;
    customerId: number;
    functions?: TFunction[];
    taskAbbreviation?: string;
    pumpType: string | null;
    pumpManufacturer: string | null;
    specifications: string | null;
    requirements: string | null;
    problemDescription: string | null;
}