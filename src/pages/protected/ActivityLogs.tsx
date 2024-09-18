import ActivityList from "@/components/activity-logs/ActivityList";
import { fetchTaskifyLogsByMonthAndYear } from "@/services/taskify-timeline-apis";
import { useState } from "react";

export default function ActivityLogs() {
    
  return (
    <div className="p-2 px-3">
      <div className="mb-3">
        <h2>Activity Logs</h2>
        <p>View all of the activities from here</p>
      </div>
      <ActivityList />
    </div>
  );
}
