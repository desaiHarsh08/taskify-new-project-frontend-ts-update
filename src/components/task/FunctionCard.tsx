import { TFunction } from "@/lib/task";
import { FunctionPrototype } from "@/lib/task-prototype";
import { fetchFunctionPrototypeById } from "@/services/function-prototype-apis";
import { getFormattedDate } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type FunctionCardProps = {
  fn: TFunction;
};

export default function FunctionCard({ fn }: FunctionCardProps) {
  const [functionPrototype, setFunctionPrototype] =
    useState<FunctionPrototype | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchFunctionPrototypeById(
          fn.functionPrototypeId as number
        );
        console.log(response);
        setFunctionPrototype(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Link
      to={`${fn.id}`}
      className="card w-75"
      style={{ fontSize: "14px", textDecoration: "none" }}
    >
      <div
        className="card-header fw-bold"
        style={{
          backgroundColor: fn?.isClosed ? "rgb(182, 227, 182)" : "#f8f8f8",
        }}
      >
        {functionPrototype?.department}
      </div>
      <div className="card-body">
        <p className="card-text">{getFormattedDate(fn.createdDate as Date)}</p>
        <p className="my-2" style={{ fontSize: "18px", fontWeight: "500" }}>
          {functionPrototype?.title}
        </p>
        <p className="card-text">{functionPrototype?.description}</p>
      </div>
    </Link>
  );
}
