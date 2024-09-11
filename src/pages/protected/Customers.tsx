import Button from "@/components/ui/Button";
import CustomersList from "@/components/customers/CustomersList";
import { useEffect, useState } from "react";
import { Customer } from "@/lib/customer";
import {
  fetchCustomers,
  fetchCustomersByEmailCityOrState,
} from "@/services/customer-apis";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@/app/slices/loadingSlice";
import Pagination from "@/components/global/Pagination";
import { selectRefetch } from "@/app/slices/refetchSlice";

export default function Customers() {
  const dispatch = useDispatch();

  const refetchFlag = useSelector(selectRefetch);

  const [pageData, setPageData] = useState({
    pageNumber: 1,
    pageSize: 0,
    totalPages: 0,
    totalRecords: 0,
  });
  const [filters, setFilters] = useState({
    email: "",
    city: "",
    state: "",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    getCustomersData(pageData.pageNumber);
  }, [refetchFlag, pageData.pageNumber]);

  const getCustomersData = async (page: number) => {
    if (
      filters.email.trim() === "" &&
      filters.city.trim() === "" &&
      filters.state.trim() === ""
    ) {
      try {
        dispatch(toggleLoading());
        const response = await fetchCustomers(page);
        setCustomers(response.content);
        setPageData({
          pageNumber: page,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
          totalRecords: response.totatRecords,
        });
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(toggleLoading());
      }
    } else {
      try {
        dispatch(toggleLoading());
        const response = await fetchCustomersByEmailCityOrState(
          page,
          filters.email,
          filters.city,
          filters.state
        );
        dispatch(toggleLoading());
        setCustomers(response.content);
        setPageData({
          pageNumber: page,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
          totalRecords: response.totatRecords,
        });
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(toggleLoading());
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageData((prev) => ({ ...prev, pageNumber: 1 })); // Reset page number when new filters are applied
    getCustomersData(1);
  };

  return (
    <div className="p-3 h-100">
      <div className="page-intro">
        <h2>Customers</h2>
        <p>View all of our customers from here!</p>
      </div>
      <div id="customer-filters" className="py-3 ">
        <form className="d-flex gap-2" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control py-1"
              id="email"
              value={filters.email}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control py-1"
              id="city"
              placeholder="type city..."
              value={filters.city}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, city: e.target.value }))
              }
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control py-1"
              id="state"
              placeholder="type state..."
              value={filters.state}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  state: e.target.value.toUpperCase(),
                }))
              }
            />
          </div>
          <div className="mb-3">
            <Button variant="info">Search</Button>
          </div>
        </form>
      </div>
      <div id="customer-container">
        <CustomersList customers={customers} />
        <div className="" style={{ height: "10%" }}>
          <Pagination
            pageNumber={pageData.pageNumber}
            totalPages={pageData.totalPages}
              setPageData={setPageData}
          />
        </div>
      </div>
    </div>
  );
}
