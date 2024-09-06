import { MonthlyStats } from "@/lib/monthly-stats";
import { fetchMonthlyStats } from "@/services/task-apis";
import { useEffect, useState } from "react";

export default function MonthlyTaskStats() {
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response =  await fetchMonthlyStats();
                setMonthlyStats(response);
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])
    
  return (
    <div className="d-flex flex-column justify-content-evenly gap-3">
      <div className="card w-100">
        <div className="card-header">This month (September 2024)</div>
        <div className="card-body pb-0 pt-2">
          <p className="card-text fs-5 d-flex gap-2 align-items-center fw-semibold justify-content-center py-0">
            All Tasks
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center justify-content-center">
          <img
            src="/month-tasks-img.jpeg"
            alt="month-tasks-img.jpeg"
            height={70}
          />
          <span className="fs-4">{monthlyStats?.tasks}</span>
        </div>
      </div>
      <div className="card w-100">
        {/* <div className="card-header">This month (September 2024)</div> */}
        <div className="card-body pb-0 pt-2">
          <p className="card-text fs-5 d-flex gap-2 align-items-center fw-semibold justify-content-center py-0">
            Completed
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center justify-content-center">
          <img
            src="/completed-task-img.avif"
            alt="completed-task-img.avif"
            height={70}
          />
          <span className="fs-4">{monthlyStats?.completed}</span>
        </div>
      </div>
      <div className="card w-100">
        <div className="card-header">This month (September 2024)</div>
        <div className="card-body pb-0 pt-2">
          <p className="card-text fs-5 d-flex gap-2 align-items-center fw-semibold justify-content-center py-0">
            High Priority
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center justify-content-center">
          <img
            src="/high-priority-img.png"
            alt="high-priority-img.png"
            height={70}
          />
          <span className="fs-4">{monthlyStats?.highPriority}</span>
        </div>
      </div>
      <div className="card w-100">
        <div className="card-body pb-0 pt-2">
          <p className="card-text fs-5 d-flex gap-2 align-items-center fw-semibold justify-content-center py-0">
            Pending Task
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center justify-content-center">
          <img src="/pending-img.webp" alt="pending-img.webp" height={70} />
          <span className="fs-4">{monthlyStats?.pending}</span>
        </div>
      </div>
    </div>
  );
}
