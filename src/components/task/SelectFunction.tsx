import DepartmentType from "@/lib/department-type";
import Button from "../ui/Button";
import TaskPrototype, { FunctionPrototype } from "@/lib/task-prototype";
import { useEffect } from "react";

type SelectFunctionProps = {
  taskPrototype: TaskPrototype;
  selectedFunctionPrototype: FunctionPrototype | null;
  setSelectedFunctionPrototype: React.Dispatch<
    React.SetStateAction<FunctionPrototype | null>
  >;
  selectedDepartment: DepartmentType;
  handleModalNavigate: (
    modalKey:
      | "assignTask"
      | "selectFunction"
      | "inputFunctionDetails"
      | "selectDepartment"
  ) => void;
  onFunctionDefaultSet: (fnPrototype: FunctionPrototype) => void;
};

export default function SelectFunction({
  taskPrototype,
  setSelectedFunctionPrototype,
  handleModalNavigate,
  onFunctionDefaultSet,
  selectedDepartment,
  selectedFunctionPrototype,
}: SelectFunctionProps) {
  useEffect(() => {
    console.log(selectedDepartment);
  }, [selectedDepartment, selectedFunctionPrototype]);

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
        {/* {console.log(selectedFunctionPrototype)}
        {console.log(taskPrototype.functionPrototypes)} */}
        <select
          onChange={handleChange}
          value={selectedFunctionPrototype?.title}
          className="form-select"
          aria-label="Default select example"
        >
          {taskPrototype.functionPrototypes.map((fnPrototype) => {
            if (fnPrototype.department === selectedDepartment) {
              return (
                <option key={fnPrototype.title} value={fnPrototype.title}>
                  [{fnPrototype.department.padEnd(10, " ")}]
                  <p> - </p>
                  {fnPrototype.title}
                </option>
              );
            }
          })}
        </select>
      </div>
      <div className="d-flex justify-content-end px-2 gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleModalNavigate("selectDepartment")}
        >
          Back
        </Button>
        <Button type="button" onClick={() => handleModalNavigate("assignTask")}>
          Next
        </Button>
      </div>
    </div>
  );
}
