import { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { toast } from "react-toastify";
import { adminAllCategories } from "../../api/admin/adminCategories";
import { adminCreateProduct } from "../../api/admin/adminProductAPI";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { adminAllCollection } from "../../api/admin/adminCollection";
import { AiFillDelete } from "react-icons/ai";

export const AdminAddProduct = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [loader, setLoader] = useState(false);
  const privateAxios = useAxiosPrivate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm();

  const [productImages, setProductImages] = useState([]);

  // Fetch Categories
  const getAllCategories = async () => {
    try {
      const res = await adminAllCategories({ privateAxios });
      setAllCategories(res.data.getAllCategories);
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch categories");
    }
  };

  // Fetch Collections
  const getAllCollections = async () => {
    try {
      const res = await adminAllCollection({ privateAxios });
      setAllCollections(res.data.collections);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch collections");
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllCollections();
  }, []);

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
  };

  const [productStockList, setProductStockList] = useState([]);

  //create stock
  const addStock = (data) => {
    setProductStockList([...productStockList, data]);
    reset2();
  };

  //delete stock
  const deleteStock = (index) => {
    setProductStockList(productStockList.filter((stock, ind) => ind !== index));
  };

  // Need to be fixed
  // Create Product Submission
  const createProduct = async (data) => {
    if (productImages.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    const formData = new FormData();

    // Append form fields
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Append product stock list as JSON string
    formData.append("productStockList", JSON.stringify(productStockList));

    // Append images
    formData.append("productImages[", productImages); // Ensure the key is 'productImages'

    console.log("Final FormData Content:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      setLoader(true);
      const res = await adminCreateProduct({ privateAxios, formData });
      if (res.status === 201) {
        reset();
        setProductImages([]);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create product");
    } finally {
      setLoader(false);
    }
  };

  return (
    <DashboardWrapper>
      <div className="dashboard flex gap-4">
        <div className="col flex-[100%] p-4">
          <h1 className="text-center text-2xl font-semibold text-color">
            Add Product
          </h1>

          <h4 className="text-color mt-5">Add Stock</h4>
          <form className="mt-5" onSubmit={handleSubmit2(addStock)}>
            <div className="w-5/6 mx-auto pb-5">
              <div className="grid gap-4 lg:lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 grid-cols-1 px-5">
                <div className="relative float-label-input">
                  <input
                    {...register2("color", {
                      required: "Please enter colour!",
                    })}
                    type="text"
                    id="name"
                    name="color"
                    placeholder=" "
                    className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                  />
                  <label
                    htmlFor="name"
                    className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                  >
                    Enter Colour
                  </label>
                  <p className="text-red-600 text-sm">
                    {errors2.color?.message}
                  </p>
                </div>
                <div className="relative float-label-input">
                  <input
                    {...register2("size", {
                      required: "Please enter size!",
                    })}
                    name="size"
                    type="text"
                    id="name"
                    placeholder=" "
                    className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                  />
                  <label
                    htmlFor="name"
                    className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                  >
                    Enter Size
                  </label>
                  <p className="text-red-600 text-sm">
                    {errors2.size?.message}
                  </p>
                </div>
                <div className="relative float-label-input">
                  <input
                    {...register2("quantity", {
                      required: "Please enter Quantity!",
                    })}
                    name="quantity"
                    type="number"
                    id="name"
                    placeholder=" "
                    className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                  />
                  <label
                    htmlFor="name"
                    className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                  >
                    Enter Quantity
                  </label>
                  <p className="text-red-600 text-sm">
                    {errors2.quantity?.message}
                  </p>
                </div>
                <button
                  type="submit"
                  value="addStock"
                  id="addStock"
                  className="w-full mx-auto shadow-xl bg-gradient-to-tr cta text-white rounded-md text-lg tracking-wide transition duration-1000"
                >
                  Add Stock
                </button>
              </div>
            </div>
          </form>

          {productStockList.length > 0 && (
            <div className="w-2/3 mx-auto">
              <table className="w-full table-auto text-center text-color">
                <thead>
                  <tr>
                    <th className="input-border px-4 py-2">Color</th>
                    <th className="input-border px-4 py-2">Size</th>
                    <th className="input-border px-4 py-2">Quantity</th>
                    <th className="input-border px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {productStockList.map((stock, index) => (
                    <tr key={index} id={index}>
                      <td className="input-border px-4 py-2">{stock.color}</td>
                      <td className="input-border px-4 py-2">{stock.size}</td>
                      <td className="input-border px-4 py-2">
                        {stock.quantity}
                      </td>
                      <td className="input-border px-4 py-2">
                        <button
                          onClick={() => {
                            deleteStock(index);
                          }}
                          className="tooltip"
                        >
                          <AiFillDelete className="text-3xl text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <form
            onSubmit={handleSubmit(createProduct)}
            className="mt-6 space-y-6"
          >
            {/* Category Selection */}
            <div className="relative">
              <label className="block text-sm text-gray-600">
                Select Category
              </label>
              <select
                {...register("categoriesId", {
                  required: "Category is required!",
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Category</option>
                {allCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.catName}
                  </option>
                ))}
              </select>
              <p className="text-red-600 text-sm">
                {errors.categoriesId?.message}
              </p>
            </div>

            {/* Collection Selection */}
            <div className="relative">
              <label className="block text-sm text-gray-600">
                Select Collection
              </label>
              <select
                {...register("collectionId", {
                  required: "Collection is required!",
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Collection</option>
                {allCollections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.collectionName}
                  </option>
                ))}
              </select>
              <p className="text-red-600 text-sm">
                {errors.collectionId?.message}
              </p>
            </div>

            {/* Product Title */}
            <div className="relative">
              <label className="block text-sm text-gray-600">
                Product Title
              </label>
              <input
                {...register("productTitle", {
                  required: "Product title is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.productTitle?.message}
              </p>
            </div>

            {/* Description */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required!",
                })}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
              <p className="text-red-600 text-sm">
                {errors.description?.message}
              </p>
            </div>

            {/* Price */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Price</label>
              <input
                {...register("price", { required: "Price is required!" })}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">{errors.price?.message}</p>
            </div>

            {/* Discount Price */}
            <div className="relative">
              <label className="block text-sm text-gray-600">
                Discount Price
              </label>
              <input
                {...register("discountPrice")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* after discount price */}
            <div className="relative">
              <label className="block text-sm text-gray-600">
                After Discount Price
              </label>
              <input
                {...register("afterDiscountPrice")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Style Code */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Style Code</label>
              <input
                {...register("styleCode", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* Size */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Size</label>
              <input
                {...register("size", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* Theme */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Theme</label>
              <input
                {...register("theme", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* Comment */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Comment</label>
              <input
                {...register("comment", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* sku */}
            <div className="relative">
              <label className="block text-sm text-gray-600">SKU</label>
              <input
                {...register("sku")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Washcare */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Washcare</label>
              <input
                {...register("washcare", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* Top */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Top</label>
              <input
                {...register("top", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* Bottom */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Bottom</label>
              <input
                {...register("bottom", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* Dupatta */}
            <div className="relative">
              <label className="block text-sm text-gray-600">Dupatta</label>
              <input
                {...register("dupatta", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* Cloudinary */}
            <div className="relative">
              <label className="block text-sm text-gray-600">
                Cloudinary Folder Name
              </label>
              <input
                {...register("clodinaryFolder", {
                  required: "Style code is required!",
                })}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p>
                *Just keep the name of collection you are uploading, first
                letter capital
              </p>
              <p className="text-red-600 text-sm">
                {errors.styleCode?.message}
              </p>
            </div>

            {/* Image Upload */}
            <div className="relative">
              <label className="block text-sm text-gray-600">
                Product Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {loader ? <ButtonLoader /> : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  padding: 20px;
  background: #f8f8f8;
  min-height: 100vh;
`;

export default AdminAddProduct;
