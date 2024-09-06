import { Column } from "@/lib/task";
import { ColumnPrototype } from "@/lib/task-prototype";
import { fetchColumnPrototypeById } from "@/services/column-prototype-apis";
import { useEffect, useState } from "react";
import { fetchFile } from "@/services/column-apis";

type ColumnCardProps = {
  column: Column;
  onColumnChange: (columnPrototype: ColumnPrototype, value: unknown) => void;
};

export default function ColumnCard({
  column,
  onColumnChange,
}: ColumnCardProps) {
  const [columnPrototype, setColumnPrototype] =
    useState<ColumnPrototype | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchColumnPrototypeById(
          column.columnPrototypeId as number
        );
        setColumnPrototype(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  //   const handleFileView = async (filePath: string) => {
  //     try {
  //       const blob = await fetchFile(filePath);
  //       const url = window.URL.createObjectURL(blob);

  //       // Open the file in a new window or tab
  //       window.open(url, "_blank");

  //       // Revoke the object URL after use
  //       setTimeout(() => window.URL.revokeObjectURL(url), 100);
  //     } catch (error) {
  //       console.error("Error fetching the file:", error);
  //     }
  //   };

  // const handleFileView = async (filePath: string) => {
  //     try {
  //       const blob = await fetchFile(filePath);

  //       // Create a URL for the blob
  //       const url = window.URL.createObjectURL(blob);

  //       // Create an anchor element and trigger a download
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = filePath.split("/").pop(); // Use the file name from the path
  //       document.body.appendChild(a);
  //       a.click();

  //       // Remove the anchor element and revoke the object URL
  //       document.body.removeChild(a);
  //       window.URL.revokeObjectURL(url);
  //     } catch (error) {
  //       console.error("Error fetching the file:", error);
  //     }
  //   };

  const handleFileView = async (filePath: string) => {
    try {
      const response = await fetchFile(filePath);
      const blob = new Blob([response], { type: response.type });
      const url = window.URL.createObjectURL(blob);

      // Open or download depending on the MIME type
      if (blob.type.startsWith("image/") || blob.type === "application/pdf") {
        // Open in a new tab for images and PDFs
        window.open(url, "_blank");
      } else {
        // Download for other file types
        const a = document.createElement("a");
        a.href = url;
        a.download = filePath.split("/").pop() as string; // Extract file name from the path
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Revoke the object URL after usage
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
  };

  return (
    columnPrototype &&
    column && (
      <div>
        <div className="mb-3 d-flex flex-column gap-2">
          <p className="mt-3 my-2">{columnPrototype.name}</p>
          {columnPrototype.columnType === "FILE" &&
            column.multipartFiles &&
            column.multipartFiles?.length > 0 && (
              <>
                <input
                  type="file"
                  multiple={columnPrototype.multipleFiles}
                  className="form-control"
                />
              </>
            )}

          {column.fileDirectoryPaths &&
            column.fileDirectoryPaths.map((filePath) => {
              const parts = filePath.split(".");
              const fileExtension = parts[parts.length - 1];
              let fileLogo = "/file-logo-img.jpeg";
              if (fileExtension.toLowerCase() === "xlsx") {
                fileLogo = "/excel-logo-img.png";
              } else if (fileExtension.toLowerCase() === "pdf") {
                fileLogo = "/pdf-logo-img.png";
              } else if (
                fileExtension.toLowerCase() === "word" ||
                fileExtension.toLowerCase() === "docx"
              ) {
                fileLogo = "/word-logo-img.avif";
              }

              return (
                <div
                  className="d-flex my-3"
                  onClick={() => handleFileView(filePath)}
                >
                  <div className="p-2" style={{ cursor: "pointer" }}>
                    <img
                      src={fileLogo}
                      alt=""
                      width={70}
                      style={{ border: "1px solid #bcbcbc" }}
                    />
                  </div>
                </div>
              );
            })}

          {columnPrototype.columnType === "DATE" && (
            <input
              type="date"
              className="form-control"
              value={column.textValue as string}
              onChange={(e) => onColumnChange(columnPrototype, e.target.value)}
            />
          )}

          {columnPrototype.columnType === "STRING" && (
            <>
              {columnPrototype.largeText ? (
                <textarea
                  className="form-control"
                  rows={3}
                  value={column.textValue as string}
                  onChange={(e) =>
                    onColumnChange(columnPrototype, e.target.value)
                  }
                ></textarea>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={column.textValue as string}
                  onChange={(e) =>
                    onColumnChange(columnPrototype, e.target.value)
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
                checked={column.booleanValue as boolean}
                onChange={(e) =>
                  onColumnChange(columnPrototype, e.target.checked)
                }
              />
            </div>
          )}
        </div>
      </div>
    )
  );
}
