import Button from "../ui/Button";

type PaginationProps = {
  pageNumber: number;
  pageSize?: number;
  totalPages: number;
  totalRecords?: number;
  onPageClick: (page: number) => void;
};

export default function Pagination({
  pageNumber,
  totalPages,
  onPageClick,
}: PaginationProps) {
  console.log("pagination", pageNumber, totalPages);

  return (
    <div className="d-flex gap-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <Button
          key={index}
          outline={pageNumber !== index + 1}
          onClick={() => onPageClick(index + 1)}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  );
}
