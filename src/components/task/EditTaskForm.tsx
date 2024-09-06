import PriorityType from "@/lib/priority-type";
import Task from "@/lib/task";
import TaskPrototype from "@/lib/task-prototype";
import { fetchTaskPrototypes, updateTask } from "@/services/task-apis";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@/app/slices/loadingSlice";
import { useAuth } from "@/hooks/useAuth";

const priorities: PriorityType[] = ["NORMAL", "MEDIUM", "HIGH"];

type EditTaskFormProps = {
  task: Task;
  setTask: React.Dispatch<React.SetStateAction<Task>>;
  taskPrototype: TaskPrototype;
};

export default function EditTaskForm({
  task,
  setTask,
  taskPrototype,
}: EditTaskFormProps) {
  const dispatch = useDispatch();

  const { user } = useAuth();

  const [taskPrototypes, setTaskPrototypes] = useState<TaskPrototype[] | []>(
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchTaskPrototypes(1);
        console.log(response);
        setTaskPrototypes(response.content);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskSave = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(toggleLoading());
    try {
      const response = await updateTask(task, user?.id as number);
      console.log(response);
      setTask(response);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(toggleLoading());
    }
  };

  return (
    <form onSubmit={handleTaskSave}>
      <div style={{ height: "400px", overflowY: "auto" }}>
        <div className="mb-3">
          <label htmlFor="taskPrototypeId" className="form-label">
            Priority
          </label>
          <select
            value={task.taskPrototypeId as number}
            onChange={(e) =>
              setTask((prev) => ({
                ...prev,
                taskPrototypeId: taskPrototypes.find(
                  (t) => t.id === Number(e.target.value)
                )?.id as unknown as number,
              }))
            }
            name="taskPrototypeId"
            className="form-select"
          >
            {taskPrototypes.map((taskPrototype) => (
              <option
                key={taskPrototype.taskType}
                value={taskPrototype.id as number}
              >
                {taskPrototype.taskType}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="priorityType" className="form-label">
            Priority
          </label>
          <select
            value={task.priorityType}
            onChange={handleChange}
            name="priorityType"
            className="form-select"
            aria-label="Default select example"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="pumpType" className="form-label">
            Pump Type
          </label>
          <input
            type="text"
            className="form-control"
            name="pumpType"
            value={task.pumpType != null ? task.pumpType : ""}
            onChange={handleChange}
          />
        </div>
        {taskPrototype?.taskType !== "SERVICE_TASK" && (
          <>
            <div className="mb-3">
              <label htmlFor="pumpManufacturer" className="form-label">
                Pump Manufacturer
              </label>
              <input
                type="text"
                className="form-control"
                name="pumpManufacturer"
                value={
                  task.pumpManufacturer != null ? task.pumpManufacturer : ""
                }
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="specifications" className="form-label">
                Specifications
              </label>
              <input
                type="text"
                className="form-control"
                name="specifications"
                value={task.specifications != null ? task.specifications : ""}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div className="mb-3">
          <label htmlFor="problemDescription" className="form-label">
            Problem Description
          </label>
          <textarea
            className="form-control"
            id="problemDescription"
            rows={3}
            name="problemDescription"
            onChange={handleChange}
            value={
              task.problemDescription != null ? task.problemDescription : ""
            }
          ></textarea>
        </div>
      </div>
      <div className="mb-3 mt-4 d-flex justify-content-end">
        <Button variant={"success"}>Save</Button>
      </div>
    </form>
  );
}
