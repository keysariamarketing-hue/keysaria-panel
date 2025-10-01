import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import useFilteration from "../../hook/useFilteration";
import {
  adminGetAllStaff,
  staffActiveInactive,
} from "../../api/admin/adminStaffAPI";
import { adminGetAllRole } from "../../api/admin/adminRoleAPI";
import { DataLoader } from "../../components/general/DataLoader";
import { Switch } from "antd";

const AdminAllStaff = () => {
  const privateAxios = useAxiosPrivate();
  const [loader, setLoader] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  // const [totalPage, setTotalPage] = useState(1);
  const [allRole, setAllRole] = useState([]);

  const {
    filters,
    currentPage,
    handleFilterChange,
    clearFilters,
    previousPage,
    nextPage,
    debounce,
  } = useFilteration();

  //admin get all staff................
  const getAllStaff = async () => {
    const allData = {
      privateAxios,
      search: debounce,
      page: currentPage,
      active: filters.status,
    };
    setLoader(true);
    try {
      const res = await adminGetAllStaff(allData);
      setAllStaff(res.data);
      //   setTotalPage(res.data.totalPage);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  //admin get all role.............
  const getAllRole = async () => {
    const allData = { privateAxios };
    try {
      const res = await adminGetAllRole(allData);
      setAllRole(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async (id) => {
    const allData = { privateAxios, id };
    setLoader(true);
    try {
      const res = await staffActiveInactive(allData);
      setLoader(false);
      if (res.status === 200) {
        getAllStaff();
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRole();
  }, []);

  useEffect(() => {
    getAllStaff();
  }, [debounce]);

  return (
    <>
      <div>
        <div className="flex w-full sticky z-10 top-12 py-8 bg-white items-center gap-3">
          <div className="w-full">
            <h4>All Products</h4>
          </div>
          <div className="flex gap-3 justify-end w-full">
            <div className="relative float-label-input">
              <select
                type="text"
                id="category"
                name="categoriesId"
                placeholder=" "
                onChange={handleFilterChange}
                value={filters.roleId}
                className="block w-48 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
              >
                <option value="">Filter by Role</option>
                {allRole.map((role, index) => {
                  return (
                    <option key={index} value={role.id}>
                      {role.name}
                    </option>
                  );
                })}
              </select>
              {/* <label for="name" className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker">Search here</label> */}
            </div>
            <div className="relative float-label-input">
              <select
                type="text"
                id="status"
                name="status"
                onChange={handleFilterChange}
                value={filters.status}
                placeholder=" "
                className="block w-48 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
              {/* <label for="name" className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker">Search here</label> */}
            </div>

            <div className="relative float-label-input">
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder=" "
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
        <div className={`dashboard flex gap-4 overflow-scroll`}>
          {/* <div className="col lg:flex-[20%] lg:block md:hidden sm:hidden hidden">
                    <AdminSidebar />
                </div> */}
          {/* main right side start */}
          <div className="flex-[100%]">
            <div className="mt-4 overflow-hidden ">
              <div className="overflow-hidden">
                <div className="w-full space-y-4 mt-4">
                  <div className="">
                    <div className="sticky top-10"></div>
                  </div>
                  <div className="relative flex flex-col w-full h-full overflow-x-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                    {loader ? (
                      <DataLoader />
                    ) : allStaff ? (
                      <table className="w-full text-left table-auto min-w-max">
                        <thead className="text-center">
                          <tr>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Staff Name
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Role
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Email
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Phone No.
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                State
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                PinCode
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
                          {allStaff &&
                            allStaff.map((staff, index) => {
                              return (
                                <tr
                                  key={index}
                                  className="border-b border-blue-gray-50"
                                >
                                  <td className="p-4 border-2">
                                    <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {staff.fullName}
                                    </p>
                                  </td>
                                  <td className="p-4 border-2">
                                    <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {staff.role.name
                                        ? staff.role.name
                                        : "N/A"}
                                    </p>
                                  </td>
                                  <td className="p-4 border-2">
                                    <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {staff.email ? staff.email : "N/A"}
                                    </p>
                                  </td>
                                  <td className="p-4 border-2">
                                    <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {staff.phone ? staff.phone : "N/A"}
                                    </p>
                                  </td>
                                  <td className="p-4 border-2">
                                    <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {staff.state ? staff.state : "N/A"}
                                    </p>
                                  </td>
                                  <td className="p-4 border-2">
                                    <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {staff.pincode ? staff.pincode : "N/A"}
                                    </p>
                                  </td>
                                  <td className="p-4 border-2">
                                    <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {staff.isActive ? (
                                        <span className="text-green-600">
                                          Active
                                        </span>
                                      ) : (
                                        <span className="text-red-600">
                                          Inactive
                                        </span>
                                      )}
                                    </p>
                                  </td>
                                  <td className="p-4 border-2">
                                    <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <Switch
                                        defaultChecked={staff.isActive}
                                        onClick={() => handleStatus(staff.id)}
                                        color="blue"
                                      />
                                    </p>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    ) : (
                      <span className="font-bold text-xl text-center text-black">
                        No Staff found
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              {/* {totalPage} */}
            </li>

            <li>
              <button
                onClick={nextPage}
                // disabled={currentPage === totalPage}
                className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminAllStaff;
