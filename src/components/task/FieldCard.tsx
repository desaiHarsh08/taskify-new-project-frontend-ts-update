import { TFunction } from "@/lib/task";
import { ColumnPrototype, FieldPrototype } from "@/lib/task-prototype";

type FieldCardProps = {
  fieldPrototype: FieldPrototype;
  fieldPrototypeIndex: number;
  newFunction: TFunction;
  onFieldChange: (
    fieldPrototype: FieldPrototype,
    columnPrototype: ColumnPrototype,
    value: unknown
  ) => void;
};

export default function FieldCard({
  fieldPrototype,
  fieldPrototypeIndex,
  newFunction,
  onFieldChange,
}: FieldCardProps) {
  console.log("in input-field-card, newFunction:", newFunction);
  console.log("in input-field-card, fieldPrototype:", fieldPrototype);
  return (
    <div className="card">
      <div className="card-header fw-semibold">
        Field: {fieldPrototype.title}
      </div>
      <div className="card-body">
        <p className="card-text">{fieldPrototype.description}</p>
        {fieldPrototype.columnPrototypes.map(
          (columnPrototype, columnPrototypeIndex) => (
            <div
              key={`columnPrototype-${columnPrototypeIndex}`}
              className="mb-3 d-flex flex-column gap-2"
            >
              <p className="mt-3 my-2">{columnPrototype.name}</p>

              {columnPrototype.columnType === "FILE" && (
                <input
                  type="file"
                  multiple={columnPrototype.multipleFiles}
                  className="form-control"
                  onChange={(e) =>
                    onFieldChange(
                      fieldPrototype,
                      columnPrototype,
                      e.target.files
                    )
                  }
                />
              )}

              {columnPrototype.columnType === "DATE" && (
                <input
                  type="date"
                  className="form-control"
                  value={
                    newFunction.fields[fieldPrototypeIndex].columns[
                      columnPrototypeIndex
                    ].textValue || ""
                  }
                  onChange={(e) =>
                    onFieldChange(
                      fieldPrototype,
                      columnPrototype,
                      e.target.value
                    )
                  }
                />
              )}

              {columnPrototype.columnType === "STRING" && (
                <>
                  {columnPrototype.largeText ? (
                    <textarea
                      className="form-control"
                      rows={3}
                      value={
                        newFunction.fields[fieldPrototypeIndex].columns[
                          columnPrototypeIndex
                        ].textValue as string
                      }
                      onChange={(e) =>
                        onFieldChange(
                          fieldPrototype,
                          columnPrototype,
                          e.target.value
                        )
                      }
                    ></textarea>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={
                        newFunction.fields[fieldPrototypeIndex].columns[
                          columnPrototypeIndex
                        ].textValue as string
                      }
                      onChange={(e) =>
                        onFieldChange(
                          fieldPrototype,
                          columnPrototype,
                          e.target.value
                        )
                      }
                    />
                  )}
                </>
              )}

              {columnPrototype.columnType === "BOOLEAN" && (
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={
                      newFunction.fields[fieldPrototypeIndex].columns[
                        columnPrototypeIndex
                      ].booleanValue as boolean
                    }
                    onChange={(e) =>
                      onFieldChange(
                        fieldPrototype,
                        columnPrototype,
                        e.target.checked
                      )
                    }
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
