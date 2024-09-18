import DepartmentType from "@/lib/department-type";
import Button from "../ui/Button";

type SelectDepartmentProps = {
  selectedDepartment: DepartmentType;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<DepartmentType>>;
  onNavigateBackModal?: () => void; // Define the keys in the type
  onNavigateContinueModal: () => void; // Define the keys in the type
  backBtn?: boolean;
};

const departments = [
  "QUOTATION",
  "ACCOUNTS",
  "DISPATCH",
  "SERVICE",
  "CUSTOMER",
  "NONE",
];

export default function SelectDepartment({
  selectedDepartment,
  setSelectedDepartment,
  onNavigateBackModal,
  onNavigateContinueModal,
  backBtn = true,
}: SelectDepartmentProps) {
  //   useEffect(() => {
  //     // setSelectedDepartment(selectedDepartment);
  //   }, [selectedDepartment]);

  return (
    <div
      style={{ height: "300px" }}
      className="d-flex flex-column justify-content-between"
    >
      <div>
        <p className="my-2 mb-3">Select Department to forward the task</p>
        <select
          value={selectedDepartment}
          onChange={(e) =>
            setSelectedDepartment(e.target.value as DepartmentType)
          }
          className="form-select"
          aria-label="Default select example"
        >
          {departments.map((dept) => {
            if (dept !== "NONE") {
              return (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              );
            }
          })}
        </select>
      </div>
      <div className="d-flex justify-content-end p-3 gap-2">
        {backBtn && (
          <Button
            type="button"
            onClick={onNavigateBackModal}
            variant={"secondary"}
          >
            Back
          </Button>
        )}
        <Button type="button" onClick={onNavigateContinueModal}>
          Continue
        </Button>
      </div>
    </div>
  );
}
