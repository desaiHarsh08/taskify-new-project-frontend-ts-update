import { Customer } from "@/lib/customer";
import Button from "../ui/Button";
import React, { useState } from "react";
import { editCustomer } from "@/services/customer-apis";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@/app/slices/loadingSlice";
import { toggleRefetch } from "@/app/slices/refetchSlice";

type EditCustomerFormProps = {
  customer: Customer;
};

export default function EditCustomerForm({ customer }: EditCustomerFormProps) {
  const dispatch = useDispatch();

  const [tmpCustomer, setTmpCustomer] = useState({ ...customer });

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setTmpCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(toggleLoading());
    try {
      const response = await editCustomer(tmpCustomer);
      console.log(response);
      alert("Updated!");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(toggleLoading());
      dispatch(toggleRefetch());
    }
  };

  return (
    <form onSubmit={handleEditCustomer}>
      <div style={{ height: "400px", overflow: "auto" }}>
        <div className="mb-3">
          <label htmlFor="customerName" className="form-label">
            Customer Name
          </label>
          <input
            type="text"
            className="form-control"
            name="customerName"
            value={tmpCustomer.customerName}
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="customerName" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={tmpCustomer.email != null ? tmpCustomer.email : ""}
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="personOfContact" className="form-label">
            Person Of Contact
          </label>
          <input
            type="text"
            className="form-control"
            name="personOfContact"
            value={tmpCustomer.personOfContact}
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={tmpCustomer.phone}
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="state" className="form-label">
            State
          </label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={tmpCustomer.state}
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={tmpCustomer.address}
            onChange={handleCustomerChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={tmpCustomer.city}
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="pincode" className="form-label">
            Pincode
          </label>
          <input
            type="text"
            className="form-control"
            name="pincode"
            value={tmpCustomer.pincode}
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">
            Birthdate
          </label>
          <input
            type="date"
            className="form-control"
            name="birthDate"
            value={
              tmpCustomer.birthDate != null
                ? (tmpCustomer.birthDate as unknown as string)
                : ""
            }
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">
            Anniversary
          </label>
          <input
            type="date"
            className="form-control"
            name="birthDate"
            value={
              tmpCustomer.birthDate != null
                ? (tmpCustomer.anniversary as unknown as string)
                : ""
            }
            onChange={handleCustomerChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">
            Residence Address
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={tmpCustomer.residenceAddress}
            onChange={handleCustomerChange}
          ></textarea>
        </div>
      </div>
      <div className="my-3 mt-4 d-flex justify-content-end">
        <Button variant={"success"}>Edit</Button>
      </div>
    </form>
  );
}
