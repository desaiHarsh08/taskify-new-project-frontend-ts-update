import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

import SelectTaskType from "./SelectTaskType";
import SelectTaskPriority from "./SelectTaskPriority";
import InputCustomer from "./InputCustomer";
import InputTaskInfo from "./InputTaskInfo";
import AssignTask from "./AssignTask";
import TaskPrototype from "@/lib/task-prototype";
import { createTask, fetchTaskPrototypes } from "@/services/task-apis";
import User from "@/lib/user";
import { Customer } from "@/lib/customer";
import { useAuth } from "@/hooks/useAuth";
import Task from "@/lib/task";
import { createCustomer } from "@/services/customer-apis";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@/app/slices/loadingSlice";
import { toggleRefetch } from "@/app/slices/refetchSlice";
import DepartmentType from "@/lib/department-type";
import SelectDepartment from "./SelectDepartment";

type CreateNewTaskProps = {
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMessage: React.Dispatch<React.SetStateAction<string>>;
};
export default function CreateNewTask({
  setShowMessage,
  setShowToast,
}: CreateNewTaskProps) {
  const dispatch = useDispatch();

  const { user } = useAuth();

  const [newTask, setNewTask] = useState<Task>({
    taskPrototypeId: 1,
    priorityType: "NORMAL",
    createdByUserId: user?.id,
    assignedToUserId: user?.id,
    customerId: 1,
    pumpType: "",
    pumpManufacturer: "",
    specifications: "",
    requirements: "",
    problemDescription: "",
  });
  const [assignedUser, setAssignedUser] = useState<User | null>(user);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentType>("QUOTATION");
  const [customerDetails, setCustomerDetails] = useState<Customer>({
    customerName: "",
    email: "",
    personOfContact: "",
    phone: "",
    state: "",
    address: "",
    residenceAddress: "",
    city: "",
    pincode: "",
    parentCompanyId: null,
  });
  const [taskPrototypes, setTaskPrototypes] = useState<TaskPrototype[]>([]);
  const [openModal, setOpenModal] = useState({
    taskType: false,
    taskPriority: false,
    customer: false,
    taskInfo: false,
    assignTask: false,
    selectFunction: false,
    inputFunctionDetails: false,
    selectDepartment: false,
  });

  useEffect(() => {
    fetchTaskPrototypes(1)
      .then((data) => {
        console.log(data);
        setTaskPrototypes(data.content);
        setNewTask((prev) => ({
          ...prev,
          createdByUserId: user?.id,
          taskPrototypeId: data.content[0].id,
          assignedToUserId: user?.id,
        }));
      })
      .catch((error) => console.log(error));
  }, [user?.id]);

  const handleModalNavigate = (modalKey: keyof typeof openModal) => {
    setOpenModal((prev) => {
      const newOpenModal = { ...prev };
      for (const key in newOpenModal) {
        newOpenModal[key as keyof typeof newOpenModal] = key === modalKey;
      }
      return newOpenModal;
    });
  };

  const handleModalHide = (modalType: keyof typeof openModal) => {
    setOpenModal((prev) => ({
      ...prev,
      [modalType]: false,
    }));
  };

  const handleCreateTask = async () => {
    dispatch(toggleLoading());
    setOpenModal((prev) => ({ ...prev, assignTask: false }));
    const tmpTask = { ...newTask };

    console.log("Creating customer...", customerDetails);
    // Create the customer
    const customerResponse = await createCustomer(customerDetails);
    console.log(customerResponse);

    tmpTask.customerId = customerResponse.id as number;
    tmpTask.assignedToUserId = assignedUser?.id as number;

    console.log("tmpTask.assignedToUserId:", tmpTask.assignedToUserId);

    // Create the task
    console.log("Creating task...", tmpTask);
    console.log("assignedUser: ", assignedUser);
    const response = await createTask(tmpTask);
    console.log(response);

    dispatch(toggleLoading());
    dispatch(toggleRefetch());
    setShowToast(true);
    setShowMessage("New Task Created!");
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpenModal((prev) => ({ ...prev, taskType: true }))}
      >
        Create Task
      </Button>
      <Modal
        open={openModal.taskType}
        onHide={() => handleModalHide("taskType")}
        centered
        backdrop
        size="lg"
        heading="Select Task Type"
      >
        {taskPrototypes.length > 0 && (
          <SelectTaskType
            taskPrototypes={taskPrototypes}
            newTask={newTask}
            setNewTask={setNewTask}
            onNavigateModal={handleModalNavigate}
          />
        )}
      </Modal>
      <Modal
        open={openModal.taskPriority}
        onHide={() => handleModalHide("taskPriority")}
        centered
        backdrop
        size="lg"
        heading="Task Priority"
      >
        <SelectTaskPriority
          setNewTask={setNewTask}
          onNavigateModal={handleModalNavigate}
        />
      </Modal>
      <Modal
        open={openModal.customer}
        onHide={() => handleModalHide("customer")}
        centered
        backdrop
        size="xl"
        heading="Customer Details"
      >
        <InputCustomer
          onNavigateModal={handleModalNavigate}
          customerDetails={customerDetails}
          setCustomerDetails={setCustomerDetails}
        />
      </Modal>
      <Modal
        open={openModal.taskInfo}
        onHide={() => handleModalHide("taskInfo")}
        centered
        backdrop
        size="lg"
        heading={
          <p className="d-flex gap-2">
            <span>Task Info:</span>
            <span className="fs-6 d-inline-flex align-items-center rounded px-1 bg-body-secondary">
              {
                taskPrototypes.find((ele) => ele.id === newTask.taskPrototypeId)
                  ?.taskType
              }
            </span>
          </p>
        }
      >
        <InputTaskInfo
          newTask={newTask}
          taskPrototypes={taskPrototypes}
          setNewTask={setNewTask}
          onNavigateModal={handleModalNavigate}
        />
      </Modal>
      <Modal
        open={openModal.selectDepartment}
        onHide={() => handleModalHide("selectDepartment")}
        centered
        backdrop
        size="lg"
        heading="Select Department"
      >
        <SelectDepartment
          onNavigateBackModal={() => handleModalNavigate("taskInfo")}
          onNavigateContinueModal={() => handleModalNavigate("assignTask")}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
      </Modal>
      <Modal
        open={openModal.assignTask}
        onHide={() => handleModalHide("assignTask")}
        centered
        backdrop
        size="lg"
        heading="Assign Task"
      >
        {assignedUser != null && (
          <AssignTask
            selectedDepartment={selectedDepartment}
            onNavigateModal={handleModalNavigate}
            task={newTask}
            setTask={setNewTask}
            assignedUser={assignedUser}
            setAssignedUser={setAssignedUser}
            onContinue={handleCreateTask}
          />
        )}
      </Modal>
    </>
  );
}
