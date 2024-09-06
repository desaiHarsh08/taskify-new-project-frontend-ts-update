import { ParentCompany } from "@/lib/parent-company";
import styles from "@/styles/ParentCompanyRow.module.css";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";

type ParentCompanyRowProps = {
  parentCompany: ParentCompany;
  parentIndex: number;
};

export default function ParentCompanyRow({
  parentCompany,
  parentIndex,
}: ParentCompanyRowProps) {
  return (
    <div className={`${styles["parent-row-card"]} d-flex border-bottom w-100`}>
      <p
        className="form-check border-end d-flex justify-content-center align-items-center px-0 py-3"
        style={{ width: "3%" }}
      >
        <input
          className="form-check-input m-0 "
          type="checkbox"
          value=""
          id="flexCheckDefault"
        />
      </p>
      <p
        className="border-end text-center d-flex justify-content-center align-items-center py-3"
        style={{ width: "6.5%" }}
      >
        {parentIndex + 1}
      </p>
      <p
        className="border-end text-cente d-flex justify-content-center align-items-center py-3"
        style={{ width: "6.5%" }}
      >
        C{((parentCompany?.id as number) + 1).toString().padStart(4, "0")}
      </p>
      <p
        className="border-end text-center d-flex justify-content-center align-items-center py-3"
        style={{ width: "12%" }}
      >
        {parentCompany.companyName}
      </p>
      <p
        className="border-end text-center d-flex justify-content-center align-items-center py-3"
        style={{ width: "12%" }}
      >
        {parentCompany.personOfContact}
      </p>
      <p
        className="border-end text-center d-flex justify-content-center align-items-center py-3"
        style={{ width: "12%" }}
      >
        {parentCompany.phone}
      </p>
      <p
        className="border-end text-center d-flex justify-content-center align-items-center py-3"
        style={{ width: "12%" }}
      >
        {parentCompany.address}
      </p>
      <p
        className="border-end text-center d-flex justify-content-center align-items-center py-3"
        style={{ width: "12%" }}
      >
        {parentCompany.city}
      </p>
      <p
        className="border-end text-center d-flex justify-content-center align-items-center py-3"
        style={{ width: "12%" }}
      >
        {parentCompany.pincode}
      </p>
      <p
        className="border-end text-center d-flex justify-content-center align-items-center gap-2 py-3"
        style={{ width: "12%" }}
      >
        <Button type="button" size="sm" onClick={() => {}}>
          <FaEdit />
        </Button>
        <Modal
          open={false}
          onHide={() => {}}
          backdrop
          centered
          size="lg"
          heading={`Edit: ${parentCompany.companyName}`}
        >
            kjkj
          {/* <EditCustomerForm customer={customer} /> */}
        </Modal>

        <Button
          type="button"
          size="sm"
          variant="danger"
          onClick={() => {}}
        >
          <MdOutlineDeleteOutline />
        </Button>
        <Modal
          open={false}
          onHide={() => {}}
          size="lg"
          backdrop
          centered
          heading={`Delete: ${parentCompany.companyName}`}
        >
          {/* <DeleteCustomerForm /> */}
          ljlllj
        </Modal>
      </p>
    </div>
  );
}
