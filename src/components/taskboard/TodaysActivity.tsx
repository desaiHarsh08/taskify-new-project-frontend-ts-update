/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import ActivityRow from "./ActivityRow";
import { TaskifyTimeline } from "@/lib/taskify-timeline";
import { fetchTaskifyLogs } from "@/services/taskify-timeline-apis";
import { useSelector } from "react-redux";
import { selectRefetch } from "@/app/slices/refetchSlice";
import Pagination from "../global/Pagination";

const columns = ["Sr. No.", "Time", "Resource", "Action", "By"];
export default function TodaysActivity() {
  const refectFlag = useSelector(selectRefetch);

  const [taskLogs, setTaskLogs] = useState<TaskifyTimeline[] | []>([]);
  const [pageData, setPageData] = useState({
    pageNumber: 1,
    pageSize: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  useEffect(() => {
    getLogs(pageData.pageNumber);
  }, [refectFlag, pageData.pageNumber]);

  const getLogs = async (pageNumber: number) => {
    const d = new Date();
    try {
      const response = await fetchTaskifyLogs(
        pageNumber,
        `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getFullYear()}`
      );
      console.log();
      setTaskLogs(response.content);
      setPageData({
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        totalRecords: response.totalPages,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="todays-activity" className="py-3">
      <div className="my-3">
        <h2 className="p-0 m-0">Today's Activity</h2>
        <p>June 14, 2024</p>
      </div>
      <div id="todays-activity-container" className="">
        <div className="d-flex bg-light">
          {columns.map((column, columnIndex) => {
            const columnStyles = { width: "22.5%" };
            if (columnIndex === 0) {
              columnStyles.width = "10%";
            }

            return (
              <p
                className={`text-center py-1 ${columnIndex !== columns.length - 1 ? "border-end" : ""}`}
                style={columnStyles}
              >
                {column}
              </p>
            );
          })}
        </div>
        <div id="activity-rows" className="border-top overflow-y-auto">
          {taskLogs.map((taskLog, index) => (
            <ActivityRow key={`log-${index}`} taskLog={taskLog} index={index} />
          ))}
        </div>
        <Pagination
          setPageData={setPageData}
          pageNumber={pageData.pageNumber}
          totalPages={pageData.totalPages}
          pageSize={pageData.pageSize}
          totalRecords={pageData.totalRecords}
        />
      </div>
    </div>
  );
}
