import { TFunction } from "@/lib/task";
import {
  ColumnPrototype,
  FieldPrototype,
  FunctionPrototype,
} from "@/lib/task-prototype";
import Button from "../ui/Button";
import FieldCard from "./FieldCard";
import React from "react";

type InputFunctionDetailsProps = {
  newFunction: TFunction;
  selectedFunctionPrototype: FunctionPrototype | null;
  setNewFunction: React.Dispatch<React.SetStateAction<TFunction | null>>;
  handleModalNavigate: (
    modalKey: "assignTask" | "selectFunction" | "inputFunctionDetails"
  ) => void;
  onAddFunction: () => Promise<void>;
};

export default function InputFunctionDetails({
  selectedFunctionPrototype,
  newFunction,
  setNewFunction,
  handleModalNavigate,
  onAddFunction,
}: InputFunctionDetailsProps) {
  console.log("in input-fn-details, newFunction:", newFunction);

  const handleFunctionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFunction((prev) => {
      if (prev) {
        return {
          ...prev,
          functionPrototypeId: prev?.functionPrototypeId,
          taskId: prev?.taskId ?? 0,
          department: prev?.department ?? "ACCOUNTS",
          dueDate: e.target.value as unknown as Date,
          createdByUserId: prev?.createdByUserId ?? 0,
          fields: [...prev.fields],
        };
      } else {
        return newFunction;
      }
    });
  };

  const handleFieldChange = (
    fieldPrototype: FieldPrototype,
    columnPrototype: ColumnPrototype,
    value: unknown
  ) => {
    console.log("fired!");
    const tmpNewFn = { ...newFunction };
    tmpNewFn.fields = tmpNewFn.fields.map((field) => {
      if (field.fieldPrototypeId === fieldPrototype.id) {
        const newField = { ...field };
        newField.columns = newField.columns.map((col) => {
          if (col.columnPrototypeId === columnPrototype.id) {
            const newCol = { ...col };
            if (columnPrototype.columnType === "BOOLEAN") {
              newCol.booleanValue = value as boolean;
            } else if (columnPrototype.columnType === "FILE") {
              newCol.multipartFiles = value as File[];
            } else if (columnPrototype.columnType === "NUMBER") {
              newCol.numberValue = value as number;
            } else {
              // String or Date
              newCol.textValue = value as string;
            }

            return newCol;
          }

          return col;
        });

        return newField;
      }

      return field;
    });

    setNewFunction(tmpNewFn);
  };

  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ height: "400px" }}
    >
      <div className="overflow-y-auto" style={{ height: "350px" }}>
        <div className="border-bottom">
          <h5>Description</h5>
          <p>{selectedFunctionPrototype?.description}</p>
          <span className="badge text-bg-primary my-3">
            {selectedFunctionPrototype?.department}
          </span>
        </div>
        <div className="my-3">
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label my-2">
              Due Date
            </label>
            <input
              type="date"
              className="form-control"
              name="dueDate"
              id="dueDate"
              onChange={handleFunctionChange}
            />
          </div>
          <div className="d-flex flex-column gap-4 py-3">
            {selectedFunctionPrototype?.fieldPrototypes.map(
              (fieldPrototype, fieldPrototypeIndex) => (
                <FieldCard
                  key={`fieldPrototype-${fieldPrototypeIndex}`}
                  fieldPrototype={fieldPrototype}
                  fieldPrototypeIndex={fieldPrototypeIndex}
                  newFunction={newFunction}
                  onFieldChange={handleFieldChange}
                />
              )
            )}
          </div>
        </div>
      </div>
      <div className="border-top align-items-center d-flex justify-content-end gap-2 p-2">
        <Button
          outline
          variant="secondary"
          onClick={() => handleModalNavigate("assignTask")}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            onAddFunction();
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
