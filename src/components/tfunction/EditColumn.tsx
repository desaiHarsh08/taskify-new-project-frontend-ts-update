/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field } from "@/lib/task";
import { ColumnPrototype } from "@/lib/task-prototype";
import ColumnCard from "./ColumnCard";
import { useState } from "react";
import { updateColumn, uploadFiles } from "@/services/column-apis";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@/app/slices/loadingSlice";
import { toggleRefetch } from "@/app/slices/refetchSlice";
import Button from "../ui/Button";

type EditColumnProps = {
  field: Field;
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditColumn({
  field,
  setOpenEditModal,
}: EditColumnProps) {
  console.log("field:", field);
  const dispatch = useDispatch();

  const [tmpField, setTmpField] = useState(field);

  const handleChangeColumn = (
    columnPrototype: ColumnPrototype,
    value: unknown
  ) => {
    const newTmpField = { ...tmpField };
    newTmpField.columns = newTmpField.columns.map((col) => {
      if (col.columnPrototypeId === columnPrototype.id) {
        const newCol = { ...col };
        if (columnPrototype.columnType === "BOOLEAN") {
          newCol.booleanValue = value as boolean;
        } else if (columnPrototype.columnType === "DATE") {
          console.log("to set date:", value);
          newCol.dateValue = dateFormat(value as string);
        } else if (columnPrototype.columnType === "STRING") {
          newCol.textValue = value as string;
        } else if (columnPrototype.columnType === "FILE") {
          console.log("todo");
          newCol.multipartFiles = value as File[];
        } else {
          newCol.numberValue = value as number;
        }

        return newCol;
      }

      return col;
    });

    setTmpField(newTmpField);
  };

  const dateFormat = (date: string | Date | null) => {
    console.log(date);
    let tmpDate = new Date();
    if (date) {
      tmpDate = new Date(date);
    }
    const formattedDate = `${tmpDate.getFullYear()}-${(tmpDate.getMonth() + 1).toString().padStart(2, "0")}-${tmpDate.getDate().toString().padStart(2, "0")}`;

    console.log(date, "formatted date:", formattedDate);

    return formattedDate;
  };

  const handleUpdateColumns = async () => {
    dispatch(toggleLoading());
    console.log("Updating columns: ", tmpField);
    for (let i = 0; i < tmpField.columns.length; i++) {
      try {
        const response = await updateColumn(tmpField.columns[i]);
        console.log(response);
        if (tmpField.columns[i].multipartFiles) {
          const resUpload = await uploadFiles(
            response,
            tmpField.columns[i].multipartFiles as File[]
          );
          console.log(resUpload);
        }
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(toggleLoading());
    dispatch(toggleRefetch());
    setOpenEditModal(false);
  };

  return (
    <div className="d-flex justify-content-between flex-column">
      <div style={{ height: "400px", overflowY: "auto" }}>
        {tmpField.columns.map((column, columnIndex) => (
          <ColumnCard
            key={`column-${columnIndex}`}
            column={column}
            onColumnChange={handleChangeColumn}
          />
        ))}
      </div>
      <div className="d-flex justify-content-end mt-4 border-top pt-2">
        <Button
          variant={"success"}
          onClick={handleUpdateColumns}
          disabled={field.isClosed}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
