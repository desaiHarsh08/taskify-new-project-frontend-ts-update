/* eslint-disable @typescript-eslint/no-unused-vars */
import { toggleLoading } from "@/app/slices/loadingSlice";
import { selectRefetch, toggleRefetch } from "@/app/slices/refetchSlice";
import InputFunctionDetails from "@/components/task/InputFunctionDetails";

import FieldRow from "@/components/tfunction/FieldRow";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import MyToast from "@/components/ui/MyToast";
import { useAuth } from "@/hooks/useAuth";
import { Field, TFunction as FnType } from "@/lib/task";
import { FunctionPrototype } from "@/lib/task-prototype";
import { createField } from "@/services/field-apis";
import { doCloseFunction, fetchFunctionById } from "@/services/function-apis";
import { fetchFunctionPrototypeById } from "@/services/function-prototype-apis";
import { getFormattedDate } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const columns = [
  "Sr. No.",
  "Title",
  "Description",
  "Created At",
  "Last Edited",
  "Status",
  "Actions",
];

export default function TFunction() {
  const { user } = useAuth();
  console.log(user);
  const dispatch = useDispatch();
  const { functionId } = useParams();

  const refetchFlag = useSelector(selectRefetch);

  const [openAddSubFunction, setOpenAddSubFunction] = useState(false);
  const [fn, setFn] = useState<FnType | null>(null);
  const [fnBkp, setFnBkp] = useState<FnType | null>(null);
  const [fnPrototype, setFnPrototype] = useState<FunctionPrototype | null>(
    null
  );
  const [flag, setFlag] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [openDoneFn, setOpenDoneFn] = useState(false);
  const [showMessage] = useState("");

  useEffect(() => {
    console.log("refetchFlag:", refetchFlag);
    getFn();
  }, [functionId, refetchFlag, flag]);

  const getFn = async () => {
    console.log("get fn:");
    try {
      const response = await fetchFunctionById(Number(functionId));
      console.log("fetching fn:", response);

      const responseProto = await fetchFunctionPrototypeById(
        response.functionPrototypeId as number
      );

      setFn(response);
      setFnBkp(response);
      setFnPrototype(responseProto);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseFn = async () => {
    console.log(user);
    dispatch(toggleLoading());
    try {
      await doCloseFunction(fn as FnType, fn?.id as number, user?.id as number);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(toggleLoading());
      dispatch(toggleRefetch());
      setOpenDoneFn(false);
    }
  };

  const handleFunctionDefaultSet = (functionPrototype: FunctionPrototype) => {
    console.log("called fnDefaultSet:");
    const tmpNewFn: FnType = { ...fnBkp } as FnType;

    // Set the fields
    const tmpFields: Field[] = [];
    for (let i = 0; i < functionPrototype.fieldPrototypes.length; i++) {
      const fieldPrototype = functionPrototype.fieldPrototypes[i];
      const field: Field = {
        fieldPrototypeId: fieldPrototype.id as number,
        createdByUserId: user?.id,
        columns: [],
        functionId: fn?.id,
      };
      for (let j = 0; j < fieldPrototype.columnPrototypes.length; j++) {
        const columnPrototype = fieldPrototype.columnPrototypes[j];
        field.columns.push({
          columnPrototypeId: columnPrototype.id,
          createdByUserId: user?.id,
          numberValue: 0,
          textValue: "",
          dateValue: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`,
          booleanValue: false,
        });
      }
      tmpFields.push(field);
    }

    console.log("tmpFields:", tmpFields);

    tmpNewFn.fields = [...tmpNewFn.fields, ...tmpFields];

    console.log("Default set newFn:", tmpNewFn);
    setFn(tmpNewFn);
  };

  const handleAddSubFunction = async () => {
    if (!fn) {
      return;
    }
    console.log(fn);
    dispatch(toggleLoading());
    for (let i = 0; i < fn?.fields.length; i++) {
      console.log(`field-${i + 1}:`, fn.fields[i]);
      if (fn.fields[i].id) {
        continue;
      }
      try {
        const response = await createField(fn.fields[i]);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
    console.log("field is added!");
    console.log("fn:", fn);
    setFlag((prev) => !prev);
    getFn();
    dispatch(toggleLoading());
    setOpenAddSubFunction(false);
    dispatch(toggleRefetch());
  };

  const functionDetails = (
    <div className="mb-4">
      <div className="border-bottom pb-3 mb-3">
        <h2 className="d-sm-flex align-items-center gap-2">
          <p className="bg-body-secondary py-1 px-2 rounded">
            {fnPrototype?.title}
          </p>
        </h2>
        <span className="badge text-bg-primary">{fnPrototype?.department}</span>
      </div>
      {!fn?.isClosed && (
        <p className="mb-3">
          <Button
            outline
            variant={"secondary"}
            disabled={fn?.fields.some((field) => !field.isClosed)}
            onClick={() => setOpenDoneFn(true)}
          >
            Done
          </Button>
          <Modal
            open={openDoneFn}
            onHide={() => setOpenDoneFn(false)}
            backdrop
            centered
            size="lg"
            heading={
              <div className="d-flex align-items-center gap-2">
                <p>Done</p>
                <p className="text-bg-secondary badge">{fnPrototype?.title}</p>
              </div>
            }
          >
            <p className="fs-5 fw-medium mb-2">
              Are you sure that you want to mark this function as done?
            </p>
            <p>This process will not be undone, once marked.</p>
            <div className="mt-5 d-flex justify-content-end">
              <Button onClick={handleCloseFn}>Okay, Proceed</Button>
            </div>
          </Modal>
        </p>
      )}

      <p className="mb-2">
        Due Date: {getFormattedDate(fn?.dueDate as string | Date)}
      </p>
      <h4>Description</h4>
      <p>{fnPrototype?.description}</p>
    </div>
  );

  return (
    <div className="px-3 py-3 h-100">
      {functionDetails}
      <div className="mb-3">
        <Button
          type="button"
          onClick={() => setOpenAddSubFunction(true)}
          disabled={!fnPrototype?.choice}
        >
          Add Sub-Function
        </Button>
        {openAddSubFunction && (
          <Modal
            open={openAddSubFunction}
            onHide={() => setOpenAddSubFunction(false)}
            heading={"Add Sub-Function"}
            centered
            backdrop
            size="lg"
          >
            {openAddSubFunction && (
              <InputFunctionDetails
                selectedFunctionPrototype={fnPrototype}
                setSelectedFunctionPrototype={setFnPrototype}
                newFunction={fn as FnType}
                setNewFunction={setFn}
                onAddFunction={handleAddSubFunction}
                handleFunctionDefaultSet={handleFunctionDefaultSet}
                handleModalNavigate={() => {}}
              />
            )}
          </Modal>
        )}
      </div>
      <div className="table overflow-auto">
        <div
          className="thead d-flex border text-bg-light"
          style={{ minWidth: "1116px" }}
        >
          {columns.map((column, index) => {
            const columnWidth = { width: "16%" };
            if (index === 0) {
              columnWidth.width = "4%";
            }
            return (
              <p
                key={column}
                style={columnWidth}
                className={`text-center py-1 border-end ${index !== columns.length - 1 ? "border-end" : ""}`}
              >
                {column}
              </p>
            );
          })}
        </div>
        <div
          className="tbody border overflow-auto"
          style={{ minWidth: "1116px", maxHeight: "450px" }}
        >
          {fnBkp &&
            fnBkp.fields.map((field, fieldIndex) => (
              <FieldRow
                key={`fieldIndex-${fieldIndex}`}
                field={field}
                fieldIndex={fieldIndex}
              />
            ))}
        </div>
      </div>
      <MyToast
        show={showToast}
        message={showMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
