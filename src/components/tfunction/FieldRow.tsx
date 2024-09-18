import { Field } from "@/lib/task";
import FieldActions from "./FieldActions";
import { useEffect, useState } from "react";
import { FieldPrototype } from "@/lib/task-prototype";
import { fetchFieldPrototypeById } from "@/services/field-prototype-apis";
import { getFormattedDate } from "@/utils/helpers";

type FieldRowProps = {
  field: Field;
  fieldIndex: number;
};

export default function FieldRow({ field, fieldIndex }: FieldRowProps) {
  const [fieldPrototype, setFieldProtoype] = useState<FieldPrototype | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchFieldPrototypeById(
          field.fieldPrototypeId as number
        );
        setFieldProtoype(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    field &&
    fieldPrototype && (
      <div className="d-flex border-bottom">
        <p
          className="d-flex justify-content-center align-items-center border-end"
          style={{ width: "4%" }}
        >
          {fieldIndex + 1}.
        </p>
        <p
          className="d-flex justify-content-center align-items-center border-end"
          style={{ width: "16%" }}
        >
          {fieldPrototype?.title}
        </p>
        <p
          className="d-flex justify-content-center align-items-center border-end"
          style={{ width: "16%" }}
        >
          {fieldPrototype?.description}
        </p>
        <p
          className="d-flex justify-content-center align-items-center border-end"
          style={{ width: "16%" }}
        >
          {getFormattedDate(field.createdDate as string)}
        </p>
        <p
          className="d-flex justify-content-center align-items-center border-end"
          style={{ width: "16%" }}
        >
          {getFormattedDate(field.lastEdited as Date)}
        </p>
        <p
          className="d-flex justify-content-center align-items-center border-end"
          style={{ width: "16%" }}
        >
          {field.isClosed ? (
            <span className="badge text-bg-success">CLOSED</span>
          ) : (
            <span className="badge text-bg-warning">IN_PROGRESS</span>
          )}
        </p>
        <p
          className="d-flex justify-content-center align-items-center"
          style={{ width: "16%" }}
        >
          <FieldActions field={field} fieldPrototype={fieldPrototype} />
        </p>
      </div>
    )
  );
}
