/* eslint-disable @typescript-eslint/no-unused-vars */
import { toggleLoading } from "@/app/slices/loadingSlice";
import { selectRefetch, toggleRefetch } from "@/app/slices/refetchSlice";

import FieldRow from "@/components/tfunction/FieldRow";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import MyToast from "@/components/ui/MyToast";
import { useAuth } from "@/hooks/useAuth";
import { TFunction as FnType } from "@/lib/task";
import { FunctionPrototype } from "@/lib/task-prototype";
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

  const [fn, setFn] = useState<FnType | null>(null);
  const [fnPrototype, setFnPrototype] = useState<FunctionPrototype | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [openDoneFn, setOpenDoneFn] = useState(false);
  const [showMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchFunctionById(Number(functionId));
        console.log(response);

        const responseProto = await fetchFunctionPrototypeById(
          response.functionPrototypeId as number
        );

        setFn(response);
        setFnPrototype(responseProto);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [functionId, refetchFlag]);

  const handleCloseFn = async () => {
    console.log(user);
    dispatch(toggleLoading());
    try {
      await doCloseFunction(
        fn as FnType,
        fn?.id as number,
        user?.id as number
      );
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(toggleLoading());
      dispatch(toggleRefetch());
      setOpenDoneFn(false);
    }
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
        <div className="tbody border" style={{ minWidth: "1116px" }}>
          {fn &&
            fn.fields.map((field, fieldIndex) => (
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
