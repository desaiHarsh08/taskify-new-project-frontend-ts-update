import { TFunction } from "@/lib/task";
import { FunctionPrototype } from "@/lib/task-prototype";
import { fetchFunctionPrototypeById } from "@/services/function-prototype-apis";
import { getFormattedDate } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type FunctionCardProps = {
  fn: TFunction;
  fnIndex: number;
};

export default function FunctionCard({ fn, fnIndex }: FunctionCardProps) {
  const [functionPrototype, setFunctionPrototype] =
    useState<FunctionPrototype | null>(null);

  const [lastEdited, setLastEdited] = useState<Date | string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchFunctionPrototypeById(
          fn.functionPrototypeId as number
        );
        setFunctionPrototype(response);
      } catch (error) {
        console.log(error);
      }
    })();

    const lastEditedField = fn.fields.find((field) => !field.isClosed);
    setLastEdited(lastEditedField?.lastEdited as Date);
  }, [fn.fields, fn.functionPrototypeId]);

  return (
    <Link
      to={`${fn.id}`}
      className={`d-flex w-100 text-dark border-bottom text-center`}
      style={{
        fontSize: "12px",
        textDecoration: "none",
        backgroundColor: (fnIndex === 0 && !fn.isClosed) ? "#bcfddf" : "",
      }}
    >
      <p className="border-end py-2 px-1" style={{ width: "7%" }}>
        {fnIndex + 1}
      </p>
      <p className="border-end py-2 px-1" style={{ width: "15.5%" }}>
        {functionPrototype?.title}
      </p>
      <p className="border-end py-2 px-1" style={{ width: "15.5%" }}>
        {functionPrototype?.department}
      </p>
      <p className="border-end py-2 px-1" style={{ width: "15.5%" }}>
        {getFormattedDate(fn.createdDate as Date)}
      </p>
      <p className="border-end py-2 px-1" style={{ width: "15.5%" }}>
        {getFormattedDate(fn.dueDate as Date)}
      </p>
      <p className="border-end py-2 px-1" style={{ width: "15.5%" }}>
        {lastEdited && getFormattedDate(lastEdited)}
      </p>
      <p className="py-2 px-1" style={{ width: "15.5%" }}>
        {fn.isClosed && fn.closedDate ? getFormattedDate(fn.closedDate) : "-"}
      </p>
    </Link>
  );
}
