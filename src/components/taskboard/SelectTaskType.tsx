import TaskPrototype from "@/lib/task-prototype";
import Button from "../ui/Button";
import Task from "@/lib/task";

type SelectTaskTypeProps = {
  newTask: Task;
  setNewTask: React.Dispatch<React.SetStateAction<Task>>;
  taskPrototypes: TaskPrototype[];
  onNavigateModal: (
    modalKey: keyof {
      taskType: boolean;
      taskPriority: boolean;
      customer: boolean;
      taskInfo: boolean;
      assignTask: boolean;
    }
  ) => void;
};

export default function SelectTaskType({
  newTask,
  setNewTask,
  taskPrototypes,
  onNavigateModal,
}: SelectTaskTypeProps) {
  // Handler for changing the task type
  const handleTaskTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedTaskType = event.target.value;

    // Find the selected task prototype
    const selectedPrototype = taskPrototypes.find(
      (prototype) => prototype.taskType === selectedTaskType
    );

    if (selectedPrototype && selectedPrototype.id !== undefined) {
      console.log("setting task type");
      // Update the newTask state with the selected task type and other properties
      setNewTask((prevTask) => ({
        ...prevTask,
        taskPrototypeId: selectedPrototype.id,
      }));
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ height: "300px" }}
    >
      <div>
        <p className="my-2 mb-3">Task Type</p>
        <select
          className="form-select"
          aria-label="Default select example"
          value={
            taskPrototypes.find(
              (prototype) => prototype.id === newTask.taskPrototypeId
            )?.taskType
          }
          onChange={handleTaskTypeChange} // Handle changes
        >
          {taskPrototypes.map((taskPrototype) => {
            if (taskPrototype.taskType !== "COMBINED_TASK") {
                return <option key={taskPrototype.id} value={taskPrototype.taskType}>
              {taskPrototype.taskType}
            </option>
            }
          })}
        </select>
      </div>
      <div className="d-flex justify-content-end p-3">
        <Button type="button" onClick={() => onNavigateModal("taskPriority")}>
          Continue
        </Button>
      </div>
    </div>
  );
}
