/* eslint-disable @typescript-eslint/no-unused-vars */
import { toggleLoading } from "@/app/slices/loadingSlice";
import {  toggleRefetch } from "@/app/slices/refetchSlice";
import Pagination from "@/components/global/Pagination";
import AddParentCompanyForm from "@/components/parent-companies/AddParentCompanyForm";
import ParentCompaniesList from "@/components/parent-companies/ParentCompaniesList";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ParentCompany } from "@/lib/parent-company";
import {
  createParentCompany,
  fetchParentCompanies,
} from "@/services/parent-companies-apis";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function ParentCompanies() {
  const dispatch = useDispatch();

//   const refetchFlag = useSelector(selectRefetch);

  const [openAddModal, setOpenAddModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [parentCompanies, setParentCompanies] = useState<ParentCompany[] | []>(
    []
  );

  const [newParentCompany, setNewParentCompany] = useState<ParentCompany>({
    companyName: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    headOfficeAddress: "",
    personOfContact: "",
    phone: "",
    businessType: "",
  });
  const [pageData, setPageData] = useState({
    pageNumber: 1,
    pageSize: 0,
    totalPages: 0,
    totalRecords: 0,
  });

  useEffect(() => {
    getParentCompanies(1);
  }, [pageData.pageNumber]);

  const getParentCompanies = async (page: number) => {
    try {
      const response = await fetchParentCompanies(page);
      setPageData({
        pageNumber: page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        totalRecords: response.totatRecords,
      });
      setParentCompanies(response.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeNewParentCompany = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNewParentCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(toggleLoading());
    try {
      const response = await createParentCompany(newParentCompany);
      console.log(response);
      dispatch(toggleRefetch());
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(toggleLoading());
    }
  };

  return (
    <div className="p-3 h-100">
      <div className="page-intro">
        <h2>Parent Companies</h2>
        <p>View all of our parent-companies from here!</p>
      </div>
      <div id="parent-filters" className="py-3 ">
        <form
          className="d-flex gap-2"
          // onSubmit={handleSubmit}
        >
          <div>
            <Button type="button" onClick={() => setOpenAddModal(true)}>
              Add
            </Button>
            <Modal
              open={openAddModal}
              onHide={() => setOpenAddModal(false)}
              backdrop
              centered
              size="lg"
              heading={`Add Parent Company`}
            >
              <AddParentCompanyForm
                newParentCompany={newParentCompany}
                onNewParentCompanyChange={handleChangeNewParentCompany}
                onSubmit={handleAddSubmit}
              />
            </Modal>
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control py-1"
              id="email"
              //   value={filters.email}
              //   onChange={(e) =>
              //     setFilters((prev) => ({ ...prev, email: e.target.value }))
              //   }
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control py-1"
              id="city"
              placeholder="type city..."
              //   value={filters.city}
              //   onChange={(e) =>
              //     setFilters((prev) => ({ ...prev, city: e.target.value }))
              //   }
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control py-1"
              id="state"
              placeholder="type state..."
              //   value={filters.state}
              //   onChange={(e) =>
              //     setFilters((prev) => ({
              //       ...prev,
              //       state: e.target.value.toUpperCase(),
              //     }))
              //   }
            />
          </div>
          <div className="mb-3">
            <Button variant="info">Search</Button>
          </div>
        </form>
      </div>
      <div id="parent-container">
        <ParentCompaniesList parentCompanies={parentCompanies} />
        <div className="" style={{ height: "10%" }}>
          <Pagination
            pageNumber={pageData.pageNumber}
            totalPages={pageData.totalPages}
            setPageData={setPageData}
            pageSize={pageData.pageSize}
            totalRecords={pageData.totalRecords}

          />
        </div>
      </div>
    </div>
  );
}
