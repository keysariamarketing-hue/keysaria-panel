import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import useFilteration from "../../hook/useFilteration";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { Switch } from "antd";
import {
  adminGetAllCustomer,
  customerActiveInactive,
} from "../../api/admin/adminCustomerAPI";

export const AdminAllCustomers = () => {
  const {
    filters,
    currentPage,
    handleFilterChange,
    // clearFilters,
    previousPage,
    nextPage,
  } = useFilteration();

  const privateAxios = useAxiosPrivate();
  const [totalPage, setTotalPage] = useState(1);

  const [loader, setLoader] = useState(false);
  const [customers, setCustomers] = useState([]);
  // const [id, setId] = useState("");

  //get all customers
  const getAllCustomers = async () => {
    const allData = {
      privateAxios,
      fullName: filters.fullName,
      active: filters.status,
      page: currentPage,
    };
    setLoader(true);
    try {
      const res = await adminGetAllCustomer(allData);
      setCustomers(res.data.customers);
      setTotalPage(res.data.totalPage);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  //handle status function
  const handleStatus = async (id) => {
    const allData = { privateAxios, id };
    try {
      const res = await customerActiveInactive(allData);
      setCustomers(res.data.customers);

      if (res.status === 200) {
        getAllCustomers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, [filters.status, filters.fullName, currentPage]);

  return (
    <DashboardWrapper>
      <div className={`dashboard flex flex-col gap-4 overflow-scroll`}>
        {/* <div className="col lg:flex-[20%] lg:block md:hidden sm:hidden hidden">
          <AdminSidebar />
        </div> */}
        {/* main right side start */}
        <div className="col flex-[100%] p-4">
          <div className="mt-4 overflow-hidden">
            <div className="overflow-hidden">
              <div className="w-full space-y-4 mt-4 pb-20">
                <div className="">
                  <div className="sticky  top-10 ">
                    <div className="flex pt-2 w-full overflow-scroll items-center gap-3">
                      <div className="w-full">
                        <h4>All Customers</h4>
                      </div>
                      <div className="flex gap-3 justify-end w-full">
                        <div className="relative float-label-input">
                          <select
                            type="text"
                            id="name"
                            placeholder=" "
                            value={filters.status}
                            onChange={handleFilterChange}
                            name="status"
                            className="block w-48 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
                          >
                            <option value="">Select Status</option>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </select>
                          {/* <label for="name" class="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker">Search here</label> */}
                        </div>

                        <div className="relative float-label-input">
                          <input
                            type="text"
                            id="name"
                            placeholder=" "
                            name="fullName"
                            value={filters.fullName}
                            onChange={handleFilterChange}
                            className="block w-56 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                          />
                          <label
                            htmlFor="name"
                            className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                          >
                            Search here
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative flex flex-col w-full h-full overflow-x-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                  {loader ? (
                    <ButtonLoader />
                  ) : (
                    <table className="w-full text-left table-auto min-w-max">
                      <thead>
                        <tr>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Customer Name
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Gender
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              DoB
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Phone No.
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Email
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Address
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Profile Image
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Billing Addresses
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              House No
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Pincode
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              State
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Street
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Active
                            </p>
                          </th>
                          <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                              Action
                            </p>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="border-b border-blue-gray-50"
                            >
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.fullName}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.gender ? item.gender : "N/A"}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.dob ? item.dob : "N/A"}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.phone}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.email}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.address ? item.address : "N/A"}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  <img
                                    src={
                                      item.profileImage ? item.profileImage : ""
                                    }
                                    className="w-14 h-14"
                                    alt=""
                                  />
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.address ? item.address : "N/A"}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.houseNo ? item.houseNo : "N/A"}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.pincode ? item.pincode : "N/A"}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.state ? item.state : "N/A"}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.street ? item.street : "N/A"}
                                </p>
                              </td>
                              <td className="p-4 border-2 ">
                                <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {item.isActive ? (
                                    <span className="text-green-600">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="text-red-600">
                                      In Active
                                    </span>
                                  )}
                                </p>
                              </td>
                              <td className="p-4">
                                <Switch
                                  onClick={() => handleStatus(item.id)}
                                  color="blue"
                                  defaultChecked={item.isActive}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
                <nav
                  className="px-5 mt-6 flex justify-end"
                  aria-label="Page navigation example"
                >
                  <ul className="inline-flex -space-x-px text-base h-10">
                    <li>
                      <button
                        onClick={previousPage}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center px-2 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Previous
                      </button>
                    </li>
                    <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      {currentPage}
                    </li>
                    <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      OF
                    </li>
                    <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      {" "}
                      {totalPage}
                    </li>

                    <li>
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPage}
                        className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div``;
