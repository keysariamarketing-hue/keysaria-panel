import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Switch } from "antd";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { adminAllCollection } from "../../api/admin/adminCollection";

const AdminAllCollection = () => {
  const privateAxios = useAxiosPrivate();
  const [allCollections, setAllCollections] = useState([]);
  const [loader, setLoader] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Collections
  const getAllCollections = async () => {
    const allData = {
      privateAxios,
      page: currentPage,
      pageSize: 20,
    };
    setLoader(true);
    try {
      const res = await adminAllCollection(allData);
      console.log(res);

      setAllCollections(res.data.collections);
      setTotalPage(res.data.totalPage);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("Failed to fetch collections");
    }
  };

  // Handle Pagination
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    getAllCollections();
  }, [currentPage]);

  return (
    <DashboardWrapper>
      <div className="w-max">
        <h4>All Collections</h4>
      </div>

      <div className="relative flex flex-col w-full h-full overflow-x-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        {loader ? (
          <ButtonLoader />
        ) : allCollections && allCollections.length > 0 ? (
          <table className="w-full z-0 text-left table-auto min-w-max">
            <thead className="text-center">
              <tr>
                <th className="p-4 border-b border-gray-300 bg-gray-50">
                  Category Name
                </th>
                <th className="p-4 border-b border-gray-300 bg-gray-50">
                  Collection Name
                </th>
                <th className="p-4 border-b border-gray-300 bg-gray-50">
                  Created At
                </th>
                <th className="p-4 border-b border-gray-300 bg-gray-50">
                  No. of Products
                </th>
                <th className="p-4 border-b border-gray-300 bg-gray-50">
                  Is Active
                </th>
                <th className="p-4 border-b border-gray-300 bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allCollections.map((collection, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="px-2 py-2 text-center">
                    {collection.category?.catName || "N/A"}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {collection.collectionName}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {collection.product?.length || 0}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {collection.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                    <Switch defaultChecked={collection.isActive} />
                  </td>
                  <td className="px-2 py-2 text-center">Contact Dev</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span className="font-bold text-xl text-center text-black">
            No Collections Found
          </span>
        )}
      </div>

      <nav className="px-5 mt-6 flex justify-end">
        <ul className="inline-flex -space-x-px text-base h-10">
          <li>
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-2 h-10 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Previous
            </button>
          </li>
          <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
            {currentPage}
          </li>
          <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
            of
          </li>
          <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
            {totalPage}
          </li>
          <li>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPage}
              className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  padding: 20px;
  background: #f8f8f8;
  min-height: 100vh;
`;

export default AdminAllCollection;
