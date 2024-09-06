import Button from "../ui/Button";
import TaskPrototype, { FunctionPrototype } from "@/lib/task-prototype";

type SelectFunctionProps = {
  taskPrototype: TaskPrototype;
  setSelectedFunctionPrototype: React.Dispatch<
    React.SetStateAction<FunctionPrototype | null>
  >;
  handleModalNavigate: (
    modalKey: "assignTask" | "selectFunction" | "inputFunctionDetails"
  ) => void;
  onFunctionDefaultSet: (fnPrototype: FunctionPrototype) => void;
};

export default function SelectFunction({
  taskPrototype,
  setSelectedFunctionPrototype,
  handleModalNavigate,
  onFunctionDefaultSet,
}: SelectFunctionProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = event.target.value;
    const selectedFunction = taskPrototype.functionPrototypes.find(
      (fn) => fn.title === selectedTitle
    );

    onFunctionDefaultSet(selectedFunction as FunctionPrototype);

    setSelectedFunctionPrototype(selectedFunction || null);
  };

  return (
    <div
      className="py-2 d-flex flex-column justify-content-between"
      style={{ height: "400px" }}
    >
      <div>
        <p className="fs-5 mb-3">Select the function</p>
        <select
          onChange={handleChange}
          className="form-select"
          aria-label="Default select example"
        >
          {taskPrototype.functionPrototypes.map((fnPrototype) => (
            <option key={fnPrototype.title} value={fnPrototype.title}>
              {fnPrototype.department.padEnd(10, " ")}
              <p> - </p>
              {fnPrototype.title}
            </option>
          ))}
        </select>
      </div>
      <div className="d-flex justify-content-end px-2">
        <Button
          type="button"
          onClick={() => handleModalNavigate("assignTask")}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
