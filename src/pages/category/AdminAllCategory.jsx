import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import {
  adminAllCategories,
  adminDeleteCategories,
  categoryActiveInactive,
} from "../../api/admin/adminCategories";
import { Modal, Switch } from "antd";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { FaEdit } from "react-icons/fa";
import useFilteration from "../../hook/useFilteration";
import { AdminUpdateCategory } from "./AdminUpdateCategory";
import { AdminAddCategory } from "./AdminAddCategory";

export const AdminAllCategory = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    filters,
    currentPage,
    handleFilterChange,
    // clearFilters,
    previousPage,
    nextPage,
    debounce,
  } = useFilteration();
  const privateAxios = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const [addCateModal, setAddCateModal] = useState(false);
  const [id, setId] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [deleteCateModal, setDeleteCateModal] = useState(false);

  //get all categories function .............................................
  const getAllCategories = async () => {
    const allData = {
      privateAxios,
      search: debounce,
      page: currentPage,
      active: filters.status,
    };
    try {
      setIsLoading(true);
      const res = await adminAllCategories(allData);
      console.log("all categories = ", res);
      setAllCategory(res.data.getAllCategories);
      setTotalPage(res.data.totalPage);
      if (res.status == 200) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // handle status function ............................................
  const handleStatus = async (id) => {
    const allData = { privateAxios, id };
    try {
      const res = await categoryActiveInactive(allData);
      setAllCategory(res.data.getAllCategories);
      if (res.status === 203) {
        getAllCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete category function .............................................
  const deleteCategory = async () => {
    const allData = { privateAxios, id };

    try {
      const res = await adminDeleteCategories(allData);
      if (res.status === 203) {
        setDeleteCateModal(false);
        getAllCategories();
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [debounce, filters.status, currentPage]);

  return (
    <div>
      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <AdminUpdateCategory
          setOpen={setOpen}
          getAllCategories={getAllCategories}
          id={id}
        />
      </Modal>
      <Modal
        centered
        open={addCateModal}
        onCancel={() => setAddCateModal(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <AdminAddCategory
          getAllCategories={getAllCategories}
          setAddCateModal={setAddCateModal}
        />
      </Modal>

      {/* delete modal */}

      <Modal
        centered
        open={deleteCateModal}
        onCancel={() => setDeleteCateModal(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="mt-4">
          <div className="w-full overflow-hidden mt-4">
            <div className="md:flex w-full">
              <div className="w-full rounded-lg mx-auto px-5 md:px-10">
                <div className="bg-white w-full py-6 rounded-xl">
                  <div className="space-y-6 ">
                    <h1 className="text-center text-2xl font-semibold text-color">
                      Are you sure you want to delete
                    </h1>
                    <hr />
                    <div></div>
                  </div>
                  <div className=" flex justify-center ">
                    <button
                      onClick={() => setDeleteCateModal(false)}
                      className="m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000"
                    >
                      No
                    </button>
                    <button
                      type="submit"
                      value="delete"
                      id="login"
                      onClick={deleteCategory}
                      className="m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000"
                    >
                      {isLoading ? <ButtonLoader /> : "Yes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <div className="">
        <div className="">
          <div className="w-full space-y-4 mt-4 pb-5">
            <div className="flex w-full items-center  gap-3">
              <div className="w-full flex items-center gap-2  ">
                <h4>All Categories</h4>
                <button
                  onClick={() => setAddCateModal(true)}
                  className="cta p-2 rounded-md text-white"
                >
                  Add New
                </button>
              </div>

              <div className="flex gap-3 justify-end w-full">
                <div className="relative float-label-input">
                  <select
                    type="text"
                    id="name"
                    placeholder=""
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
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
                    name="search"
                    placeholder=" "
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                  />
                  <label
                    htmlFor="name"
                    className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-out px-2 text-grey-darker"
                  >
                    Search here
                  </label>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
              {isLoading ? (
                <ButtonLoader />
              ) : (
                <table className="w-full text-left table-auto min-w-max">
                  <thead>
                    <tr>
                      <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                        <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                          Thumbnail
                        </p>
                      </th>
                      <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                        <p className="block font-sans text-sm antialiased font-bold leading-none text-blue-gray-900 opacity-70">
                          Category Name
                        </p>
                      </th>
                      <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                        <p className="block font-sans text-sm antialiased font-bold leading-none text-blue-gray-900 opacity-70">
                          Category Id
                        </p>
                      </th>
                      <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                        <p className="block text-center font-sans text-sm antialiased font-bold leading-none text-blue-gray-900 opacity-70">
                          Status
                        </p>
                      </th>
                      <th className="p-4 flex justify-center border-b border-blue-gray-100 bg-blue-gray-50">
                        <p className="block font-sans text-sm antialiased font-bold leading-none text-blue-gray-900 opacity-70">
                          Action
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCategory &&
                      allCategory.map((item, index) => {
                        return (
                          <tr
                            key={index}
                            className="border-b border-blue-gray-50"
                          >
                            <td className="p-4">
                              <p className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                <img
                                  src={item.image}
                                  className="w-14 h-14"
                                  alt=""
                                />
                              </p>
                            </td>
                            <td className="p-4">
                              <p className="block capitalize font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                {item.catName}
                              </p>
                            </td>
                            <td className="p-4">
                              <p className="block capitalize font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                {item.id}
                              </p>
                            </td>

                            <td className="p-4">
                              <p className="block  text-center font-sans text-md antialiased leading-relaxed font-normal ">
                                {item.isActive ? (
                                  <span className="text-green-600">Active</span>
                                ) : (
                                  <span className="text-red-600">Inactive</span>
                                )}
                              </p>
                            </td>
                            <td className="p-4 flex justify-center gap-6">
                              <Switch
                                onClick={() => handleStatus(item.id)}
                                color="blue"
                                defaultChecked={item.isActive}
                              />
                              <button
                                onClick={() => {
                                  setOpen(true);
                                  setId(item.id);
                                }}
                                className="tooltip"
                              >
                                <FaEdit className="text-3xl text-blue-600" />
                                <span className="tooltiptext">Edit</span>
                              </button>

                              {/* <button
                                onClick={() => {
                                  setDeleteCateModal(true);
                                  setId(item.id);
                                }}
                                className="tooltip"
                              >
                                <AiFillDelete className="text-3xl text-red-600" />
                                <span className="tooltiptext">Delete</span>
                              </button> */}
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
  );
};
