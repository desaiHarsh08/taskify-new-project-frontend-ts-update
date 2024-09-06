import { selectRefetch } from "@/app/slices/refetchSlice";
import MonthlyTaskStats from "@/components/taskboard/MonthlyTaskStats";
import OverallTaskStats from "@/components/taskboard/OverallTaskStats";
import TodaysActivity from "@/components/taskboard/TodaysActivity";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function TaskBoard() {
  const refetchFlag = useSelector(selectRefetch);

  useEffect(() => {}, [refetchFlag]);

  return (
    <div className="container-fluid p-3 h-100 w-100 border overflow-auto">
      <div id="taskboard-area" className="gap-3 h-100">
        <div id="taskboard-a1">
          <OverallTaskStats />
          {window.innerWidth > 767 ? <TodaysActivity /> : <MonthlyTaskStats />}
        </div>
        <div id="taskboard-a2" className="  o verflow-auto">
          {window.innerWidth > 767 ? <MonthlyTaskStats /> : <TodaysActivity />}
        </div>
      </div>
    </div>
  );
}
