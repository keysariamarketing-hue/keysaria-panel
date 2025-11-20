import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Switch, Modal } from "antd";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { adminAllCollection, adminCreateCollection, adminDeleteCollection, adminUpdateCollection } from "../../api/admin/adminCollection";
import { adminAllCategories } from "../../api/admin/adminCategories";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";

const AdminAllCollection = () => {
  const privateAxios = useAxiosPrivate();
  const [allCollections, setAllCollections] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [createLoader, setCreateLoader] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [collectionImage, setCollectionImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [updateCollectionName, setUpdateCollectionName] = useState("");
  const [updateCategoryId, setUpdateCategoryId] = useState("");
  const [updateImage, setUpdateImage] = useState(null);

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

  // Handle Delete Collection
  const handleDeleteCollection = async () => {
    if (!selectedCollectionId) return;
    setDeleteLoader(true);
    try {
      const res = await adminDeleteCollection({ privateAxios, id: selectedCollectionId });
      if (res.status === 200) {
        toast.success("Collection deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedCollectionId(null);
        getAllCollections();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete collection");
    } finally {
      setDeleteLoader(false);
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

  // Fetch Categories for dropdown
  const getAllCategories = async () => {
    try {
      const res = await adminAllCategories({ privateAxios });
      setAllCategories(res.data.getAllCategories);
      // Debug: Check categories structure
      console.log("Categories fetched:", res.data.getAllCategories);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch categories");
    }
  };

  // Handle Create Collection
  const handleCreateCollection = async () => {
    if (!collectionName || !selectedCategory || !collectionImage) {
      toast.error("Please fill all fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("collectionName", collectionName);
    formData.append("categoriesId", selectedCategory);
    formData.append("image", collectionImage);
    
    // Debug: Check what's being sent
    console.log("Selected Category ID:", selectedCategory);
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setCreateLoader(true);
    try {
      const res = await adminCreateCollection({ 
        privateAxios, 
        data: formData 
      });
      
      if (res.status === 201) {
        toast.success("Collection created successfully!");
        setIsCreateModalOpen(false);
        setCollectionName("");
        setSelectedCategory("");
        setCollectionImage(null);
        getAllCollections(); // Refresh collections list
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create collection");
    } finally {
      setCreateLoader(false);
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCollectionImage(file);
    }
  };

  // Handle Update Image Upload
  const handleUpdateImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateImage(file);
    }
  };

  useEffect(() => {
    getAllCollections();
    getAllCategories();
  }, [currentPage]);

  return (
    <DashboardWrapper>
      <div className="flex justify-between items-center mb-4">
        <h4>All Collections</h4>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Create Collection
        </button>
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
                  <td className="px-2 py-2 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCollectionId(collection.id);
                        setUpdateCollectionName(collection.collectionName || "");
                        setUpdateCategoryId(collection.category?.id || "");
                        setUpdateImage(null);
                        setIsUpdateModalOpen(true);
                      }}
                      className="tooltip inline-flex items-center justify-center"
                      title="Edit Collection"
                    >
                      <FaEdit className="text-2xl text-blue-600" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCollectionId(collection.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="tooltip inline-flex items-center justify-center"
                      title="Delete Collection"
                    >
                      <AiFillDelete className="text-3xl text-red-600" />
                    </button>
                  </td>
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

      {/* Create Collection Modal */}
      <Modal
        title="Create New Collection"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={500}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Name
            </label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter collection name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {allCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.catName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {collectionImage && (
              <p className="text-sm text-green-600 mt-1">
                Image selected: {collectionImage.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCollection}
              disabled={createLoader}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createLoader ? "Creating..." : "Create Collection"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Collection Confirmation Modal */}
      <Modal
        title="Delete Collection"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        width={420}
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this collection? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCollection}
              disabled={deleteLoader}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleteLoader ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Update Collection Modal */}
      <Modal
        title="Update Collection"
        open={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        footer={null}
        width={500}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Name
            </label>
            <input
              type="text"
              value={updateCollectionName}
              onChange={(e) => setUpdateCollectionName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter collection name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Category
            </label>
            <select
              value={updateCategoryId}
              onChange={(e) => setUpdateCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {allCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.catName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpdateImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {updateImage && (
              <p className="text-sm text-green-600 mt-1">
                Image selected: {updateImage.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!updateCollectionName || !updateCategoryId) {
                  toast.error("Please provide name and category");
                  return;
                }
                setUpdateLoader(true);
                try {
                  const fd = new FormData();
                  fd.append("collectionName", updateCollectionName);
                  fd.append("categoriesId", updateCategoryId);
                  if (updateImage) {
                    fd.append("image", updateImage);
                  }
                  const res = await adminUpdateCollection({
                    privateAxios,
                    id: selectedCollectionId,
                    data: fd,
                  });
                  if (res.status === 200) {
                    toast.success("Collection updated successfully!");
                    setIsUpdateModalOpen(false);
                    setSelectedCollectionId(null);
                    setUpdateCollectionName("");
                    setUpdateCategoryId("");
                    setUpdateImage(null);
                    getAllCollections();
                  }
                } catch (error) {
                  console.log(error);
                  toast.error("Failed to update collection");
                } finally {
                  setUpdateLoader(false);
                }
              }}
              disabled={updateLoader}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {updateLoader ? "Updating..." : "Update Collection"}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  padding: 20px;
  background: #f8f8f8;
  min-height: 100vh;
`;

export default AdminAllCollection;
