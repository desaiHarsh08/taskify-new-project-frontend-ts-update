import ActionType from "./action-type";
import ResourceType from "./resource-type";

export interface TaskifyTimeline {
    id?: number;
    userId: number;
    resourceType: ResourceType;
    actionType: ActionType;
    atDate: Date;
    taskId: number | null;
    functionId: number | null;
    fieldId: number | null;
    taskAbbreviation: string | null;
}