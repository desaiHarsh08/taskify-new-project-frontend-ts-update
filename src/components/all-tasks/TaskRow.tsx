import Task from "@/lib/task";
import { getFormattedDate } from "@/utils/helpers";
import { Link } from "react-router-dom";

import styles from "@/styles/TaskRow.module.css";
import { useEffect, useState } from "react";
import TaskPrototype from "@/lib/task-prototype";
import { fetchTaskPrototypeById } from "@/services/task-prototype-apis";

type TaskRowProps = {
  task: Task;
  taskIndex: number;
  selectedTasks: Task[];
  onSelectTask: (task: Task) => void;
};
export default function TaskRow({
  task,
  taskIndex,
  onSelectTask,
  selectedTasks,
}: TaskRowProps) {
  const [taskPrototype, setTaskPrototype] = useState<TaskPrototype | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchTaskPrototypeById(
          task.taskPrototypeId as number
        );
        setTaskPrototype(response);
      } catch (error) {
        console.log("Unable to fetch the data");
      }
    })();
  }, [task.taskPrototypeId]);

  return (
    <div
      className={`${styles["task-row-card"]} d-flex border-bottom`}
      style={{ paddingRight: "14px" }}
    >
      <p
        className="form-check border-end d-flex justify-content-center align-items-center"
        style={{ width: "3%" }}
      >
        <input
          className="form-check-input m-0 "
          type="checkbox"
          checked={selectedTasks.some((t) => t.id === task.id)}
          onChange={() => onSelectTask(task)}
        />
      </p>
      <p className="border-end text-center" style={{ width: "7%" }}>
        {taskIndex + 1}.
      </p>
      <p className="border-end text-center" style={{ width: "13%" }}>
        #{task.taskAbbreviation}
      </p>
      <p className="border-end text-center" style={{ width: "13%" }}>
        {taskPrototype?.taskType}
      </p>
      <p className="border-end text-center" style={{ width: "13%" }}>
        {task.priorityType === "HIGH" && (
          <span className="badge bg-danger">{task.priorityType}</span>
        )}
        {task.priorityType === "MEDIUM" && (
          <span className="badge bg-secondary">{task.priorityType}</span>
        )}
        {task.priorityType === "NORMAL" && (
          <span className="badge bg-light text-dark border">
            {task.priorityType}
          </span>
        )}
      </p>
      <p className="border-end text-center" style={{ width: "13%" }}>
        {getFormattedDate(task.createdDate as Date)}
      </p>
      <p className="border-end text-center" style={{ width: "13%" }}>
        {!task.isClosed ? (
          <span className="badge bg-warning">IN_PROGRESS</span>
        ) : (
          <span className="badge bg-success">CLOSED</span>
        )}
      </p>
      <p className="border-end text-center" style={{ width: "13%" }}>
        {task.isClosed ? getFormattedDate(task.closedDate as Date) : "-"}
      </p>
      <p className="border-end text-center" style={{ width: "13%" }}>
        <Link
          to={`/home/tasks/${task.id}`}
          className="btn btn-primary py-1"
          style={{ fontSize: "14px" }}
        >
          View
        </Link>
      </p>
    </div>
  );
}
