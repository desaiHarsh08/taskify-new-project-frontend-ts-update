import Task from "@/lib/task";
import FunctionCard from "./FunctionCard";

type FunctionsListProps = {
  task: Task;
};

export default function FunctionsList({ task }: FunctionsListProps) {
  return (
    <div
      id="function-container"
      className="d-flex flex-column align-items-center gap-4 py-4 overflow-auto pb-5"
    >
      {task.functions?.map((fn, fnIndex) => (
        <FunctionCard key={`fn-${fnIndex}`} fn={fn} />
      ))}
    </div>
  );
}
