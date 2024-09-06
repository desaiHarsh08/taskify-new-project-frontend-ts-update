import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import SelectFunction from "./SelectFunction";
import TaskPrototype, { FunctionPrototype } from "@/lib/task-prototype";
import AssignTask from "../taskboard/AssignTask";
import User from "@/lib/user";
import Task, { Field, TFunction } from "@/lib/task";
import InputFunctionDetails from "./InputFunctionDetails";
import { fetchTaskPrototypeById } from "@/services/task-prototype-apis";
import { useAuth } from "@/hooks/useAuth";
import { updateTask } from "@/services/task-apis";
import { createFunction } from "@/services/function-apis";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@/app/slices/loadingSlice";

import { uploadFiles } from "@/services/column-apis";
import { toggleRefetch } from "@/app/slices/refetchSlice";

type AddFunctionProps = {
  task: Task;
  setTask: React.Dispatch<React.SetStateAction<Task>>;
};

export default function AddFunction({ task, setTask }: AddFunctionProps) {
  const { user } = useAuth();

  const dispatch = useDispatch();

  const [taskPrototype, setTaskPrototype] = useState<TaskPrototype | null>();
  const [assignedUser, setAssignedUser] = useState<User | null>(null);
  const [newFunction, setNewFunction] = useState<TFunction | null>(null);
  const [selectedFunctionPrototype, setSelectedFunctionPrototype] =
    useState<FunctionPrototype | null>(null);
  const [openModal, setOpenModal] = useState({
    selectFunction: false,
    assignTask: false,
    inputFunctionDetails: false,
    taskType: false,
    taskPriority: false,
    customer: false,
    taskInfo: false,
  });

  useEffect(() => {
    (async () => {
      const response = await fetchTaskPrototypeById(
        Number(task.taskPrototypeId)
      );

      console.log("response for task-prototype:", response);

      // Set the task_prototype
      setTaskPrototype(response);

      handleFunctionDefaultSet(response.functionPrototypes[0]);

      setSelectedFunctionPrototype(response.functionPrototypes[0]);
    })();
  }, [task.id, user?.id]);

  const handleFunctionDefaultSet = (fnPrototype: FunctionPrototype) => {
    const tmpNewFn: TFunction = {
      functionPrototypeId: fnPrototype.id,
      taskId: task.id,
      department: "NONE",
      createdByUserId: user?.id,
      dueDate: new Date(),
      fields: [],
    };

    // Set the fields
    const tmpFields: Field[] = [];
    for (let i = 0; i < fnPrototype.fieldPrototypes.length; i++) {
      const fieldPrototype = fnPrototype.fieldPrototypes[i];
      console.log("Looping, fieldPrototype: ", fieldPrototype);
      const field: Field = {
        fieldPrototypeId: fieldPrototype.id as number,
        createdByUserId: user?.id,
        columns: [],
      };
      for (let j = 0; j < fieldPrototype.columnPrototypes.length; j++) {
        const columnPrototype = fieldPrototype.columnPrototypes[j];
        field.columns.push({
          columnPrototypeId: columnPrototype.id,
          createdByUserId: user?.id,
          numberValue: 0,
          textValue: "",
          booleanValue: false,
        });
      }

      console.log("looped, fieldPrototype:", fieldPrototype);
      tmpFields.push(field);
    }
    tmpNewFn.fields = [...tmpFields];
    setNewFunction(tmpNewFn);
  };

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

  const handleAddFunction = async () => {
    if (!newFunction) {
      return;
    }
    console.log("newFunction: ", newFunction);
    const tmpNewFn = { ...newFunction };
    console.log("tmpNewFn:", tmpNewFn);
    tmpNewFn.dueDate = tmpNewFn.dueDate + "T00:00:00";
    dispatch(toggleLoading());
    try {
      const response = await createFunction(tmpNewFn as TFunction);
      console.log(response);
      //   Upload the files
      for (let i = 0; i < tmpNewFn?.fields?.length; i++) {
        for (let j = 0; j < tmpNewFn.fields[i].columns.length; j++) {
          const col = tmpNewFn.fields[i].columns[j];
          if (col.multipartFiles && col.multipartFiles?.length > 0) {
            const fields = response.fields.filter(
              (ele) =>
                ele.fieldPrototypeId === tmpNewFn.fields[i].fieldPrototypeId
            );
            for (let k = 0; k < fields.length; k++) {
              const clm = fields[k].columns.find(
                (ele) => ele.columnPrototypeId === col.columnPrototypeId
              );
              if (clm) {
                try {
                  const resCol = await uploadFiles(clm, col.multipartFiles);
                  console.log(resCol);
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(toggleLoading());
      dispatch(toggleRefetch());
      setOpenModal({
        selectFunction: false,
        assignTask: false,
        inputFunctionDetails: false,
        taskType: false,
        taskPriority: false,
        customer: false,
        taskInfo: false,
      });
    }
  };

  return (
    newFunction && (
      <div>
        <Button
          type="button"
          onClick={() => handleModalNavigate("selectFunction")}
          disabled={task.functions?.some((fn) => !fn.isClosed) as boolean}
        >
          Add
        </Button>
        <Modal
          open={openModal.selectFunction}
          onHide={() => handleModalHide("selectFunction")}
          centered
          backdrop
          heading="Add Function"
          size="lg"
        >
          {taskPrototype && (
            <SelectFunction
              taskPrototype={taskPrototype}
              setSelectedFunctionPrototype={setSelectedFunctionPrototype}
              handleModalNavigate={handleModalNavigate}
              onFunctionDefaultSet={handleFunctionDefaultSet}
            />
          )}
        </Modal>
        <Modal
          open={openModal.assignTask}
          onHide={() => handleModalHide("assignTask")}
          centered
          backdrop
          heading="Assign Task"
          size="lg"
        >
          <AssignTask
            task={task}
            setTask={setTask}
            assignedUser={assignedUser}
            onNavigateModal={handleModalNavigate}
            setAssignedUser={setAssignedUser}
            onContinue={async () => {
              if (assignedUser?.id !== user?.id) {
                setTask((prev) => ({
                  ...prev,
                  assignedToUserId: assignedUser?.id,
                }));
                try {
                  const response = await updateTask(task, user?.id as number);
                  console.log(response);
                } catch (error) {
                  console.log(error);
                }

                dispatch(toggleLoading());
                try {
                  const newFnResponse = await createFunction(newFunction);
                  console.log(newFnResponse);
                } catch (error) {
                  console.log(error);
                } finally {
                  dispatch(toggleLoading());
                  dispatch(toggleRefetch());
                  setOpenModal((prev) => ({ ...prev, assignTask: false }));
                }
              } else {
                handleModalNavigate("inputFunctionDetails");
              }
            }}
          />
        </Modal>
        <Modal
          open={openModal.inputFunctionDetails}
          onHide={() => handleModalHide("inputFunctionDetails")}
          centered
          backdrop
          heading={
            <p className="d-flex gap-2 align-items-center">
              {/* <span>Function:</span> */}
              <span className="badge bg-body-secondary text-dark rounded">
                {selectedFunctionPrototype?.title}
              </span>
            </p>
          }
          size="lg"
        >
          <InputFunctionDetails
            selectedFunctionPrototype={selectedFunctionPrototype}
            newFunction={newFunction as TFunction}
            setNewFunction={
              setNewFunction as React.Dispatch<
                React.SetStateAction<TFunction | null>
              >
            }
            handleModalNavigate={handleModalNavigate}
            onAddFunction={handleAddFunction}
          />
        </Modal>
      </div>
    )
  );
}
