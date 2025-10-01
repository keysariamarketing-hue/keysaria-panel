import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import {
  adminDeleteTimeslot,
  adminGetAllSandookOrders,
  adminGetAllTimeslot,
  adminSetTimeslot,
  adminUpdateSandookOrderStatus,
  getSlotbyId,
  returnSandookOrderAPI,
} from "../../api/admin/sandookAPI";
import { Modal } from "antd";
import { MdDelete } from "react-icons/md";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { DataLoader } from "../../components/general/DataLoader";

const AdminGetAllSandook = () => {
  const [address, setAddress] = useState(null);
  const [dataLoader, setDataLoader] = useState(false);
  const [allSandook, setAllSandook] = useState([]);
  const privateAxios = useAxiosPrivate();
  const [allProductModal, setAllProductModal] = useState(false);
  const [customerSandookOrder, setCustomerSandookOrder] = useState(null);
  const [timeSlotModel, setTimeSlotModel] = useState(false);
  const [timeSlot, setTimeSlot] = useState([]);
  const [allTimeslotModel, setAllTimeslotModel] = useState(false);
  const [allTimeslot, setAllTimeslot] = useState([]);
  const [timeslotDeleteModel, setTimeslotDeleteModel] = useState(false);
  const [timeSlotId, setTimeslotId] = useState("");
  const [time, setTime] = useState("");
  const [shippingAddressDialog, setShippingAddressDialog] = useState(false);
  const [billingAddressDialog, setBillingAddressDialog] = useState(false);
  const [returnOrder, setReturnOrder] = useState(false);
  // const [returnProductId, setReturnProductId] = useState('');
  const [confirmReturnModal, setConfirmReturnModal] = useState(false);
  // const [quantity, setQuantity] = useState(0);
  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState("");
  const [returnedProducts, setReturnedProducts] = useState([]);

  const date = customerSandookOrder && customerSandookOrder.timeSlotDate;

  const getSandookProduct = async () => {
    setDataLoader(true);
    const allData = { privateAxios };
    try {
      const res = await adminGetAllSandookOrders(allData);
      setDataLoader(false);
      console.log(res);
      setAllSandook(res.data);
    } catch (error) {
      setDataLoader(false);
      console.log(error);
    }
  };

  const closeTimeslotModel = () => {
    setTimeSlotModel(false);
    setTimeSlot([]);
  };

  //convert to 12 hour
  const convertTo12Hour = (time) => {
    // Split the time into hours and minutes
    let [hours, minutes] = time.split(":").map(Number);

    // Determine AM or PM
    let period = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour format to 12-hour format
    hours = hours % 12 || 12; // If hour is 0, display as 12

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Return formatted time
    return `${hours}:${minutes} ${period}`;
  };

  //get all timeslots..................
  const getAllTimeslot = async () => {
    const allData = { privateAxios };
    try {
      const res = await adminGetAllTimeslot(allData);
      if (res.status === 200) {
        setAllTimeslot(res.data.timeSlots);
        console.log("getAllTimeslot", res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get timeslot by id...................
  const getTimeslotById = async () => {
    const allData = { privateAxios, timeSlotId };
    if (timeSlotId !== "") {
      try {
        const res = await getSlotbyId(allData);
        if (res.status === 200) {
          setTime(res.data.timeSlot.slotName);
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  //add timeslot.......................
  const addTimeslot = async (event) => {
    const to = convertTo12Hour(event.target.to.value);
    const from = convertTo12Hour(event.target.from.value);
    const maxOrders = event.target.maxOrders.value;
    setTimeSlot([...timeSlot, `${from} - ${to} Max Orders: ${maxOrders}`]);
    const slotName = (from + "-" + to).toString();
    const allData = { privateAxios, slotName, maxOrders };
    try {
      await adminSetTimeslot(allData);
    } catch (error) {
      console.log(error);
    }
  };

  //delete timeslot....................
  const deleteTimeslot = async () => {
    const allData = {
      privateAxios,
      timeSlotId,
    };
    try {
      await adminDeleteTimeslot(allData);
      setTimeslotDeleteModel(false);
      setTimeslotId("");
      getAllTimeslot();
    } catch (error) {
      console.log(error);
    }
  };

  //return sandook product api call here...............
  const returnSandookProduct = async () => {
    setLoader(true);
    const allData = {
      privateAxios,
      returnedProducts: returnedProducts,
      orderId: customerSandookOrder.id,
    };
    try {
      const res = await returnSandookOrderAPI(allData);
      setLoader(false);
      if (res.status === 200) {
        // completeReturnAPI({ privateAxios, returnProductId: res.data.returnProductId });
        console.log(res);
        setConfirmReturnModal(false);
        getSandookProduct();
        setReturnOrder(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  //update order status.....................
  const updateOrderStatus = async (orderId) => {
    console.log("status", orderId, status);
    const allData = {
      privateAxios,
      orderId,
      status,
    };
    try {
      const res = await adminUpdateSandookOrderStatus(allData);
      console.log(res);
      getSandookProduct();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromReturn = (item) => {
    const updated = returnedProducts.filter(
      (i) => i.productStockId !== item.productStock.id
    );
    setReturnedProducts(updated);
  };

  const handleReturn = (item) => {
    console.log("item", item);
    setReturnedProducts([
      ...returnedProducts,
      {
        productId: item.product.id,
        productStockId: item.productStock.id,
        quantity: 0,
      },
    ]);
  };

  const handelReturnQuantity = (e, item) => {
    if (e.target.value === "") {
      e.target.value = 0;
    }

    if (parseInt(e.target.value) > item.quantity) {
      e.target.value = item.quantity;
    }
    const index = returnedProducts.findIndex(
      (i) =>
        i.productId === item.product.id &&
        i.productStockId === item.productStock.id
    );
    const updated = [...returnedProducts];
    updated[index].quantity = parseInt(e.target.value);
    setReturnedProducts(updated);
  };

  useEffect(() => {
    console.log("returnedProducts", returnedProducts);
  }, [returnedProducts]);

  useEffect(() => {
    getSandookProduct();
  }, []);

  useEffect(() => {
    getTimeslotById();
  }, [timeSlotId]);

  return (
    <>
      {/* products order Modal */}
      <Modal
        open={allProductModal}
        onCancel={() => {
          setTimeslotId("");
          setAllProductModal(false);
        }}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        style={{ width: "max-content" }}
      >
        <div className="mt-5">
          <div className="w-full text-right font-semibold mb-2">
            <h5>Timeslot: {time && time}</h5>
            <h5>
              Date:{" "}
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h5>
          </div>
          <div className=" grid grid-cols-2 grid-flow-row gap-4">
            {customerSandookOrder &&
              customerSandookOrder.sandok.sandokProduct.map((i, index) => {
                return (
                  <div className="shadow-md w-full " key={index}>
                    <img
                      src={i.product.bannerImage}
                      className="h-20 object-cover w-full"
                      alt=""
                    />
                    <div>
                      <span className="font-semibold ">Name: </span>
                      {i.product.productTitle}
                    </div>
                    <div>
                      <span className="font-semibold ">Color: </span>
                      {i.productStock.color}
                    </div>
                    <div>
                      <span className="font-semibold ">Size: </span>
                      {i.productStock.size}
                    </div>
                    <div>
                      <span className="font-semibold ">Quantity: </span>
                      {i.quantity}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Modal>
      {/* see timeslots Modal */}
      <Modal
        open={allTimeslotModel}
        onCancel={() => setAllTimeslotModel(false)}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        centered
      >
        <div className="mt-5">
          {allTimeslot && allTimeslot.length > 0 ? (
            <table className="w-full">
              <thead className="text-center text-white text-lg">
                <tr>
                  <th className="border border-black bg-gray-600">Timeslot</th>
                  <th className="border border-black bg-gray-600">
                    Max Orders
                  </th>
                  <th className="border border-black bg-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="text-center text-lg">
                {allTimeslot &&
                  allTimeslot.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="border border-gray-600">
                          {item.slotName}
                        </td>
                        <td className="border border-gray-600">
                          {item.maxOrders}
                        </td>
                        <td className="border border-gray-600">
                          <button
                            onClick={() => {
                              setTimeslotId(item.id);
                              setTimeslotDeleteModel(true);
                            }}
                          >
                            <MdDelete className="text-xl text-red-600" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ) : (
            <h4>No Timeslots</h4>
          )}
        </div>
      </Modal>
      {/* Add timeslot Modal */}
      <Modal
        open={timeSlotModel}
        onCancel={closeTimeslotModel}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        centered
      >
        <div className="mt-5">
          <h4 className="w-full text-center">Add Timeslots</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTimeslot(e);
            }}
          >
            <fieldset className="border border-black rounded-md p-4">
              <legend className="ml-5">Add Time Slot</legend>
              <div className="flex flex-col gap-2">
                <div className="flex">
                  <label htmlFor="from" className="font-medium w-10">
                    From:
                  </label>
                  <input
                    type="time"
                    className="ml-2 font-medium border border-gray-500 rounded-md px-2"
                    name="from"
                  />
                </div>
                <div className="flex">
                  <label htmlFor="to" className="font-medium w-10">
                    To:
                  </label>
                  <input
                    type="time"
                    className="ml-2 font-medium border border-gray-500 rounded-md px-2"
                    name="to"
                  />
                </div>
                <div>
                  <label htmlFor="maxOrders" className="font-medium ">
                    Max Orders:
                  </label>
                  <input
                    type="number"
                    className="w-32 ml-2 font-medium border border-gray-500 rounded-md px-2 py-1"
                    name="maxOrders"
                  />
                </div>
              </div>
              <div className="w-full flex justify-center mt-5">
                <button className="w-40 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
          {timeSlot.map((item, index) => {
            return (
              <div key={index} className="flex gap-2">
                <h5 className="">{index + 1}.</h5>
                <h5 className="font-medium" key={index}>
                  {item}
                </h5>
              </div>
            );
          })}
          <div className="flex gap-2 w-full justify-around mt-5">
            <button
              onClick={closeTimeslotModel}
              className="w-40 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
            >
              Done
            </button>
            <button
              onClick={closeTimeslotModel}
              className="w-40 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      {/* Delete timeslot confirmation Modal */}
      <Modal
        open={timeslotDeleteModel}
        onCancel={() => setTimeslotDeleteModel(false)}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        centered
      >
        <h3 className="mt-5">
          Are you sure you want to delete this time slot?
        </h3>
        <div className="flex justify-around w-full mt-5">
          <button
            onClick={deleteTimeslot}
            className="input-border px-6 py-2 rounded-md hover:text-white hover:bg-[#b33601]"
          >
            Yes
          </button>
          <button
            className="cta px-6 py-2 rounded-md text-white"
            onClick={() => setTimeslotDeleteModel(false)}
          >
            No
          </button>
        </div>
      </Modal>
      {/* Billing address Modal */}
      <Modal
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        centered
        width={400}
        title="Billing Address"
        open={billingAddressDialog}
        onOk={() => setBillingAddressDialog(false)}
        onCancel={() => setBillingAddressDialog(false)}
      >
        <span className="font-semibold">Name: </span>
        {address != null && address.billingAdresses.fullName}
        {<br />}
        <span className="font-semibold">Address: </span>
        {address != null && address.billingAdresses.address}
        {<br />}
        <span className="font-semibold">City: </span>{" "}
        {address != null && address.billingAdresses.city}
        {<br />}
        <span className="font-semibold">State: </span>
        {address != null && address.billingAdresses.state}
        {<br />}
        <span className="font-semibold"> Pin Code: </span>{" "}
        {address != null && address.billingAdresses.pincode}
        {<br />}
      </Modal>
      {/* Shipping address Modal */}
      <Modal
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        centered
        width={400}
        title="Shipping Address"
        open={shippingAddressDialog}
        onOk={() => setShippingAddressDialog(false)}
        onCancel={() => setShippingAddressDialog(false)}
      >
        <span className="font-semibold">Name: </span>
        {address != null && address.shippingAddress.fullName}
        {<br />}
        <span className="font-semibold">Address: </span>
        {address != null && address.shippingAddress.address}
        {<br />}
        <span className="font-semibold">City: </span>{" "}
        {address != null && address.shippingAddress.city}
        {<br />}
        <span className="font-semibold">State: </span>
        {address != null && address.shippingAddress.state}
        {<br />}
        <span className="font-semibold"> Pin Code: </span>{" "}
        {address != null && address.shippingAddress.pincode}
        {<br />}
      </Modal>
      {/* return order Modal */}
      <Modal
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        centered
        width={"max-content"}
        title="Return Order"
        open={returnOrder}
        onOk={() => setReturnOrder(false)}
        onCancel={() => setReturnOrder(false)}
      >
        <div>
          <table className="w-full min-w-max">
            <thead className="rounded-md">
              <tr className="bg-gray-500 text-white font-semibold">
                <th className="border border-black px-2 py-3">Product Name</th>
                <th className="border border-black px-2 py-3">Product Image</th>
                <th className="border border-black px-2 py-3">
                  Product Quantity
                </th>
                <th className="border border-black px-2 py-3">Return</th>
                <th className="border border-black px-2 py-3">
                  Return Request
                </th>
              </tr>
            </thead>
            <tbody>
              {customerSandookOrder &&
                customerSandookOrder.sandok.sandokProduct.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center text-base font-normal border border-gray-500"
                  >
                    <td>
                      Name: {item.product.productTitle}
                      {<br />}
                      Sku: {item.product.sku}
                    </td>
                    <td className="p-4 border border-gray-500">
                      <img
                        className="h-28"
                        src={item.product.thumbnail}
                        alt=""
                      />
                    </td>
                    <td className="border border-gray-500 p-4">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-500 p-4">
                      {customerSandookOrder.totalReturnedItems > 0 ? (
                        <span className="text-red-600">Returned</span>
                      ) : (
                        <button
                          disabled={customerSandookOrder.totalReturnedItems > 0}
                          onClick={
                            returnedProducts
                              .map((i) => i.productId && i.productStockId)
                              .includes(item.product.id && item.productStockId)
                              ? () => handleRemoveFromReturn(item)
                              : () => handleReturn(item)
                          }
                          className="cta px-4 py-2 text-white rounded-full"
                        >
                          {returnedProducts
                            .map((i) => i.productId && i.productStockId)
                            .includes(item.product.id && item.productStockId)
                            ? "Cancel"
                            : "Return"}
                        </button>
                      )}
                    </td>
                    <td className="border border-gray-500 p-4">
                      {returnedProducts
                        .map((i) => i.productId && i.productStockId)
                        .includes(item.product.id && item.productStockId) &&
                        customerSandookOrder?.totalReturnedItems == 0 && (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              className="input-border w-40 px-4 py-2 rounded-md"
                              max={item.quantity}
                              // value={quantity}
                              value={
                                returnedProducts.find(
                                  (i) => i.productId === item.product.id
                                )?.quantity
                              }
                              // onChange={(e) => setQuantity(e.target.value)}
                              onChange={(e) => handelReturnQuantity(e, item)}
                              placeholder="Enter Quantity"
                              min={0}
                            />
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="w-full flex justify-end mt-5">
            <button
              disabled={customerSandookOrder?.totalReturnedItems > 0}
              className="cta rounded-full px-4 py-2 text-white"
              onClick={() => {
                setConfirmReturnModal(true);
              }}
            >
              Final Return
            </button>
          </div>
        </div>
      </Modal>
      {/* confirm return Modal */}
      <Modal
        open={confirmReturnModal}
        onCancel={() => {
          setConfirmReturnModal(false);
        }}
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        style={{ width: "max-content" }}
      >
        <div className="mt-5">
          <h1 className="text-xl">
            Are you sure you want to return these produts/?
          </h1>
          <div className="flex w-full justify-around items-center mt-5 px-32">
            <button
              onClick={() => {
                returnSandookProduct();
                getSandookProduct();
              }}
              className="cta px-8 py-2 text-white rounded-md"
            >
              {loader ? <ButtonLoader /> : "Yes"}
            </button>
            <button
              onClick={() => setConfirmReturnModal(false)}
              className="cta px-8 py-2 text-white rounded-md"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
      <div>
        <div className="flex w-full z-10 justify-between px-2 sticky top-12 py-8 bg-white items-center gap-3">
          <div className="flex w-max gap-3 justify-start items-center">
            <div className="relative float-label-input">
              <select
                type="text"
                id="status"
                name="status"
                placeholder=" "
                // onChange={handleFilterChange}
                // value={filters.status}
                className="block w-34 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
              >
                <option value="">Order Status</option>
                <option value="INPROCESS">In Process</option>

                <option value="DELIVERED">Delivered</option>

                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => setTimeSlotModel(true)}
                className="w-40 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
              >
                Add TimeSlots
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  getAllTimeslot();
                  setAllTimeslotModel(true);
                }}
                className="w-40 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
              >
                View All TimeSlots
              </button>
            </div>
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
                  <div className="relative flex flex-col w-full h-full overflow-x-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                    {dataLoader ? (
                      <DataLoader />
                    ) : allSandook.length > 0 ? (
                      <table className="w-full z-0 text-left table-auto min-w-max">
                        <thead className="text-center">
                          <tr>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Customer Name
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Ordered On
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Ordered For
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Order Status
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Product Detail
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Billing Address
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Shipping Address
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Cancel Requested
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Return Products
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Total Sold Items
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Total Returned Items
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Update Order Status
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {allSandook.map((order, index) => (
                            <tr
                              key={index}
                              className="border-b border-blue-gray-50"
                            >
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {order.customer.fullName}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {new Date(
                                    order.timeSlotDate
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {order.status}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  <button
                                    onClick={() => {
                                      setCustomerSandookOrder(order);
                                      setAllProductModal(true);
                                      setTimeslotId(order.timeSlotId);
                                    }}
                                    className="bg-[#b33601] text-white rounded-full px-4 py-1"
                                  >
                                    View Products
                                  </button>
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  <button
                                    onClick={() => {
                                      setAddress(order);
                                      setBillingAddressDialog(true);
                                    }}
                                    className="bg-[#b33601] text-white rounded-full px-4 py-1"
                                  >
                                    Show Billing Address
                                  </button>
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  <button
                                    onClick={() => {
                                      setAddress(order);
                                      setShippingAddressDialog(true);
                                    }}
                                    className="bg-[#b33601] text-white rounded-full px-4 py-1"
                                  >
                                    Show Shipping Address
                                  </button>
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {order.orderCancelRequest ? (
                                    <span className="text-red-600">
                                      Requested
                                    </span>
                                  ) : (
                                    <span className="text-green-600">
                                      Not Requested
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  <button
                                    onClick={() => {
                                      setCustomerSandookOrder(order);
                                      setReturnOrder(true);
                                    }}
                                    className="bg-[#b33601] text-white rounded-full px-4 py-1"
                                  >
                                    Return Product
                                  </button>
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {order.totalSoldItems}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {order.totalReturnedItems}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="space-x-2 block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  <select
                                    name="orderStatus"
                                    onChange={(e) => {
                                      setStatus(e.target.value);
                                    }}
                                    className="input-border px-4 py-2 rounded-full"
                                    id="orderStatus"
                                  >
                                    <option value="">Select Status</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                  </select>
                                  <button
                                    onClick={() => {
                                      updateOrderStatus(order.id);
                                    }}
                                    className="cta px-4 py-1 rounded-full text-white"
                                  >
                                    Update
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex justify-center items-center h-96">
                        <h2>No orders found</h2>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminGetAllSandook;
