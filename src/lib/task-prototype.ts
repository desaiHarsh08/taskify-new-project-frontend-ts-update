import ColumnType from "./column-type"
import DepartmentType from "./department-type"

export interface ColumnPrototype {
    id?: number | null | undefined;
    name: string;
    columnType: ColumnType;
    largeText: boolean;
    multipleFiles: boolean;
    notifyCustomer: boolean
}

export interface FieldPrototype {
    id?: number | null | undefined;
    title: string;
    description: string;
    columnPrototypes: ColumnPrototype[]
}

export interface FunctionPrototype {
    id?: number | null | undefined;
    title: string;
    description: string;
    department: DepartmentType;
    choice: boolean;
    fieldPrototypes: FieldPrototype[]
}

export default interface TaskPrototype {
    id?: number | null | undefined;
    taskType: string;
    functionPrototypes: FunctionPrototype[]
}