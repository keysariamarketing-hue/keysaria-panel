import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import {
  adminDeleteProduct,
  adminGetAllProduct,
  productActiveInactive,
  updateFeaturedProduct,
} from "../../api/admin/adminProductAPI";
import { toast } from "react-toastify";
import { adminAllCategories } from "../../api/admin/adminCategories";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import useFilteration from "../../hook/useFilteration";
import { Drawer, Modal, Switch, Tooltip } from "antd";
import { IconButton } from "@material-tailwind/react";
import { BiSolidCoupon } from "react-icons/bi";
import { FaEdit, FaFilter, FaTags } from "react-icons/fa";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import {
  adminApplyCoupon,
  admitGetAllCoupons,
} from "../../api/admin/adminCouponAPI";
import { adminApplyTag, getAllTagList } from "../../api/admin/adminTagAPI";

export const AdminAllProduct = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    reset: reset2,
  } = useForm();

  const {
    filters,
    handleFilterChange,
    previousPage,
    currentPage,
    nextPage,
    debounce,
    clearFilters,
  } = useFilteration();

  const textColor = "#b33601";
  const privateAxios = useAxiosPrivate();
  const [allProducts, setAllProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [id, setId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterReset, setFilterReset] = useState(0);
  const [allTags, setAllTags] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [option, setOption] = useState(true);
  const [allCoupons, setAllCoupons] = useState([]);

  const handleCheck = (id) => {
    if (!isChecked.includes(id)) {
      setIsChecked([...isChecked, id]);
    } else {
      setIsChecked(isChecked.filter((ids) => ids !== id));
    }
  };

  const handleAllCheck = (e) => {
    setIsChecked(
      e.target.checked ? allProducts && allProducts.map((item) => item.id) : []
    );
  };

  //get all categories.................
  const getAllCategories = async () => {
    const allData = {
      privateAxios,
    };
    setLoader(true);
    try {
      const res = await adminAllCategories(allData);
      setAllCategories(res.data.getAllCategories);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  //get all product......................
  const getAllProducts = async () => {
    const allData = {
      privateAxios,
      search: debounce,
      active: filters.status,
      page: currentPage,
      pageSize: 10,
      categories: filters.categoriesId,
      maxPrice: filters.maxPrice,
      minPrice: filters.minPrice,
    };
    setLoader(true);
    try {
      const res = await adminGetAllProduct(allData);
      setAllProducts(res.data.getAllProducts);
      console.log("res.data.getAllProducts", res.data.getAllProducts);
      setTotalPage(res.data.totalPage);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast.error(error);
    }
  };

  // active inactive product api call here............
  const handleActiveInactive = async (id) => {
    const allData = {
      privateAxios,
      id,
    };
    try {
      const res = await productActiveInactive(allData);
      getAllProducts();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // featured product update api call here............
  const handleFeaturedProducts = async (id) => {
    const allData = {
      privateAxios,
      id,
    };
    try {
      await updateFeaturedProduct(allData);
      // console.log(res);
      getAllProducts();
    } catch (error) {
      console.log(error);
    }
  };

  //delete product api call here.............
  const deleteProduct = async () => {
    const allData = { privateAxios, id };
    try {
      const res = await adminDeleteProduct(allData);
      if (res.status === 200) {
        getAllProducts();
        setId(null);
        setDeleteDialogOpen(false);
        toast.success("Deleted successfully");
      }
      toast.success();
    } catch (error) {
      setDeleteDialogOpen(false);
      setId(null);
      console.log(error);
    }
  };

  //get all tags api................
  const getAllTags = async () => {
    const allData = { privateAxios };
    try {
      const res = await getAllTagList(allData);
      setAllTags(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //apply tag to product............
  const applyTag = async (data) => {
    const allData = { privateAxios, data: { ...data, productIds: isChecked } };
    try {
      await adminApplyTag(allData);
      getAllProducts();
    } catch (error) {
      console.log(error);
    }
  };

  //get all coupons.........
  const getAllCoupons = async () => {
    const allData = {
      privateAxios,
    };
    try {
      const res = await admitGetAllCoupons(allData);
      setAllCoupons(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //apply coupon to products..........
  const applyCoupon = async (data) => {
    const allData = { privateAxios, data: { ...data, productList: isChecked } };
    try {
      const res = await adminApplyCoupon(allData);
      if (res.status === 200) {
        console.log(res, isChecked);
        getAllProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //remove coupon.............
  const removeTags = async () => {
    const allData = { privateAxios, productIds: isChecked, tagId };
  };

  //resetFilters
  const resetFilters = () => {
    clearFilters();
    setFilterOpen(false);
    setFilterReset(1);
  };

  useEffect(() => {
    getAllCategories();
    getAllTags();
    getAllCoupons();
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [
    debounce,
    filters.status,
    filters.categoriesId,
    currentPage,
    filterReset,
  ]);

  return (
    <DashboardWrapper>
      <Modal
        centered
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div>
          <h4 className="font-semibold">
            Are you sure you want to delete this product?
          </h4>
          <div className="flex gap-5">
            <button
              type="submit"
              value="login"
              id="login"
              className="mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              value="login"
              id="login"
              className="mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
              onClick={deleteProduct}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
      <Drawer
        className="p-4"
        size={300}
        placement="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <div className="mb-6 flex justify-between items-center">
          <h5 className="font-medium">Filters</h5>

          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setFilterOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex gap-2 w-full">
            <div className="relative float-label-input w-1/2">
              <input
                type="number"
                className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice ? filters.minPrice : ""}
                onChange={handleFilterChange}
                placeholder=""
              />
              <label
                htmlFor="minPrice"
                className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
              >
                Min price
              </label>
            </div>
            <div className="relative float-label-input w-1/2">
              <input
                type="number"
                className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                id="maxPrice"
                name="maxPrice"
                placeholder=""
                value={filters.maxPrice ? filters.maxPrice : ""}
                onChange={handleFilterChange}
              />
              <label
                htmlFor="minPrice"
                className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
              >
                Max price
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h5>Min Price</h5>
            <input
              type="range"
              max={10000}
              min={0}
              className="slider"
              step={50}
              name="minPrice"
              value={filters.minPrice ? filters.minPrice : ""}
              onChange={handleFilterChange}
            />
            <h5>Max Price</h5>
            <input
              type="range"
              max={10000}
              min={0}
              className="slider"
              step={50}
              name="maxPrice"
              value={filters.maxPrice ? filters.maxPrice : ""}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={resetFilters}
              className="w-2/4 mx-auto input-border py-2 rounded-md text-lg tracking-wide transition duration-1000"
            >
              Reset Filter
            </button>
            <button
              onClick={() => {
                getAllProducts();
                setFilterOpen(false);
                setFilterReset(0);
              }}
              className="w-2/4 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
            >
              Add filters
            </button>
          </div>
        </div>
      </Drawer>
      <div>
        <div className="w-max">
          <h4>All Products</h4>
        </div>
        <div className="flex w-full z-10 justify-between px-2 sticky top-12 py-8 bg-white items-center gap-3">
          <div className="flex w-max gap-3 justify-start items-center">
            <div className="relative float-label-input">
              <select
                type="text"
                id="category"
                name="categoriesId"
                placeholder=" "
                onChange={handleFilterChange}
                value={filters.categoriesId}
                className="block w-34 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
              >
                <option value="">Filter by Category</option>
                {allCategories.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.catName}
                    </option>
                  );
                })}
              </select>
              {/* <label for="name" className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker">Search here</label> */}
            </div>
            <div className="relative">
              <select
                type="text"
                id="status"
                name="status"
                onChange={handleFilterChange}
                value={filters.status}
                placeholder=" "
                className="block w-36 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
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
                className="block w-52 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
              />
              <label
                htmlFor="name"
                className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
              >
                Search Product name
              </label>
            </div>
          </div>
          <div className="w-max flex gap-5">
            {option ? (
              <form className="flex gap-2" onSubmit={handleSubmit(applyTag)}>
                <div>
                  <select
                    {...register("tagId", {
                      required: "Please select tag!",
                    })}
                    id="tag"
                    name="tagId"
                    placeholder=""
                    className="block w-48 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
                  >
                    <option value="">Select Tag</option>
                    {allTags &&
                      allTags.map((tag, index) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                  </select>
                  <p className="text-red-600 text-sm">
                    {errors.tagId?.message}
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-40 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
                  >
                    Apply Tag
                  </button>
                  <p className="text-red-600 text-sm">
                    {errors.productId?.message}
                  </p>
                </div>
              </form>
            ) : (
              <form
                className="flex gap-2"
                onSubmit={handleSubmit2(applyCoupon)}
              >
                <div>
                  <select
                    {...register2("couponId", {
                      required: "Please select Coupon!",
                    })}
                    id="coupon"
                    name="couponId"
                    placeholder=""
                    className="block w-48 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
                  >
                    <option value="">Select Coupons</option>
                    {allCoupons &&
                      allCoupons.map((coupon) => (
                        <option key={coupon.id} value={coupon.id}>
                          {coupon.couponCode}
                        </option>
                      ))}
                  </select>
                  <p className="text-red-600 text-sm">
                    {errors2.couponId?.message}
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-40 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
                  >
                    Apply Coupon
                  </button>
                </div>
              </form>
            )}
            {option ? (
              <>
                <button
                  className="bg-[#b33601] px-2 rounded-md text-white"
                  onClick={removeTags}
                >
                  Remove Tags
                </button>

                <Tooltip title="Apply Coupons" color={textColor}>
                  <IconButton
                    className="bg-[#b33601]"
                    onClick={() => setOption(!option)}
                  >
                    <BiSolidCoupon className="text-2xl" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <button
                  className="bg-[#b33601] px-2 rounded-md text-white"
                  onClick={removeTags}
                >
                  Remove Coupons
                </button>
                <Tooltip title="Apply Tags" color={textColor}>
                  <IconButton
                    className="bg-[#b33601]"
                    onClick={() => setOption(!option)}
                  >
                    <FaTags className="text-2xl" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="Filters" color={textColor}>
              <IconButton
                className="bg-[#b33601]"
                onClick={() => setFilterOpen(true)}
              >
                <FaFilter className="text-xl" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={`dashboard flex gap-4 overflow-scroll`}>
          {/* <div className='col lg:flex-[20%] lg:block md:hidden sm:hidden hidden'>
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
                      <ButtonLoader />
                    ) : allProducts && allProducts.length > 0 ? (
                      <table className="w-full z-0 text-left table-auto min-w-max">
                        <thead className="text-center">
                          <tr>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5"
                                  checked={
                                    isChecked.length === allProducts.length
                                  }
                                  onChange={handleAllCheck}
                                />
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Product Id
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Category Name
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Type
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50 sticky left-0">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Product Title
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Description
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Price
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Product Image
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Discount Percent
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                After Discount Price
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Coupon
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Tag
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Fabric
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Is Active
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Fit
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Wash
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Featured
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Actions
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {allProducts &&
                            allProducts.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  className="border-b border-blue-gray-50"
                                >
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <input
                                        {...register("productId", {
                                          required: "Please select Product!",
                                        })}
                                        type="checkbox"
                                        className="w-5 h-5"
                                        name="productId"
                                        onChange={() => handleCheck(item.id)}
                                        checked={
                                          isChecked.length > 0 &&
                                          isChecked.includes(item.id)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.id}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.categories.catName}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.type}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.productTitle}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block max-w-52 font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {/* {item.description} */}
                                      {item.description.length > 30
                                        ? item.description.slice(0, 30) + "..."
                                        : item.description}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.price}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <img
                                        className="w-20 h-20 object-cover"
                                        src={item.productImage[0]}
                                        alt=""
                                      />
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.discountPercent
                                        ? item.discountPercent
                                        : "N/A"}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.afterDiscountPrice}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      &#8377;
                                      {item.couponId !== null
                                        ? item.couponPrice
                                        : "N/A"}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.Tag ? item.Tag.name : "N/A"}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.fabric}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.isActive ? (
                                        <div className="text-green-600">
                                          Active
                                        </div>
                                      ) : (
                                        <span className="text-red-600">
                                          InActive
                                        </span>
                                      )}
                                      <div>
                                        <Switch
                                          onClick={() =>
                                            handleActiveInactive(item.id)
                                          }
                                          color="blue"
                                          defaultChecked={item.isActive}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.fit}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.wash}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="font-sans font-normal text-blue-gray-700">
                                      <Switch
                                        onClick={() =>
                                          handleFeaturedProducts(item.id)
                                        }
                                        defaultChecked={item.featuredProduct}
                                        color="blue"
                                      />
                                      {/* {item.featuredProduct ? 'Yes' : 'No'} */}
                                    </div>
                                  </td>
                                  <td className="border-2 px-2 py-2 ">
                                    <div className="flex justify-center items-center gap-6 font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <Link
                                        to={`/dashboard/admin/update/product/${item.id}`}
                                      >
                                        {/* <button
                                          onClick={() => {
                                            setOpen(true);
                                            setId(item.id);
                                          }}
                                          className="tooltip"
                                        > */}
                                        <FaEdit className="text-3xl text-blue-600" />
                                        <span className="tooltiptext">
                                          Edit
                                        </span>
                                        {/* </button> */}
                                      </Link>

                                      <button
                                        onClick={() => {
                                          setDeleteDialogOpen(true);
                                          setId(item.id);
                                        }}
                                        className="tooltip"
                                      >
                                        <AiFillDelete className="text-3xl text-red-600" />
                                        <span className="tooltiptext">
                                          Delete
                                        </span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    ) : (
                      <span className="font-bold text-xl text-center text-black">
                        No Product found
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
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 50px;
    background: #b33601;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background-color: white;
    border: black solid 1px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
  }
`;
