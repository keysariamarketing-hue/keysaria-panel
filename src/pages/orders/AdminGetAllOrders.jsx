import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import useFilteration from "../../hook/useFilteration";
import {
  adminCancelOrder,
  adminCancelShipment,
  adminGetShipRocketToken,
  adminProductStatusUpdate,
  createNewOrderForCourier,
  generateAWBAndShipmentAPI,
  getAllOrders,
  getCouierAwailStatus,
  orderSetShipRocketValues,
  schedulePickupAPI,
} from "../../api/admin/adminOrdersAPI";
import { Modal } from "antd";
import { DataLoader } from "../../components/general/DataLoader";
import { ButtonLoader } from "../../components/general/ButtonLoader";

const AdminGetAllOrders = () => {
  const privateAxios = useAxiosPrivate();
  const [loader, setLoader] = useState(false);
  const [dataLoader, setDataLoader] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [billingAddressDialog, setBillingAddressDialog] = useState(false);
  const [shippingAddressDialog, setShippingAddressDialog] = useState(false);
  const [address, setAddress] = useState(null);
  const [token, setToken] = useState("");
  const [couriersList, setCouriersList] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [courierId, setCourierId] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [pickupDialog, setPickupDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [shipment_id, setShipment_id] = useState("");
  const [orderStatusChange, setOrderStatusChange] = useState("");

  // Function to format the date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Get today's date
  const today = new Date();

  // Get the max date (3 days from now)
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);

  const { filters, handleFilterChange, previousPage, currentPage, nextPage } =
    useFilteration();

  //get all orders..................
  const adminGetAllOrders = async () => {
    setDataLoader(true);
    const alldata = {
      privateAxios,
      status: filters.status,
      paymentStatus: filters.paymentStatus,
      page: currentPage,
      pageSize: 20,
      // orderReturnRequest,
      // orderReturnConfirm,
    };
    try {
      setDataLoader(false);
      const res = await getAllOrders(alldata);
      setAllOrders(res.data.getAllOrders);
      setTotalPage(res.data.totalPage);
      console.log(res.data.getAllOrders);
    } catch (error) {
      setDataLoader(false);
      console.log(error);
      toast.error("Failed to get all orders");
    }
  };

  //get shiprocket token.........
  const getShipRocketTokens = async () => {
    const allData = { privateAxios };
    try {
      const res = await adminGetShipRocketToken(allData);
      setToken(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //create order...................
  const createNewOrder = async (orderId) => {
    setLoader(true);
    const alldata = { privateAxios, orderId };
    try {
      setLoader(false);
      const res = await createNewOrderForCourier(alldata);
      console.log(res.data);
      toast.success("Order created successfully");
      adminGetAllOrders();
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("Failed to create order");
    }
  };

  //check courier availibility................
  const getCourierAvail = async (deliveryPin, order_id) => {
    setLoader(true);
    console.log("order_id", order_id);
    if (deliveryPin) {
      const allData = { deliveryPin, token };
      console.log(allData);
      try {
        const res = await getCouierAwailStatus(allData);
        if (res.data.status === 200) {
          setLoader(false);
          setCouriersList(res.data.data.available_courier_companies);
        }
        if (res.data.status === 404) {
          setLoader(false);
          toast.error(res.data.message);
        }
      } catch (error) {
        // toast.error(res)
        setLoader(false);
        console.log(error);
      }
    }
  };

  //generate shipment and awb................
  const generateAWBAndShipment = async (shipmentID, courierId, orderId) => {
    console.log("shipmentID", shipmentID, courierId);
    if (!courierId) {
      toast.error("Please get Courier!");
    } else {
      setLoader(true);
      const allData = {
        privateAxios,
        shipmentID,
        courierId,
        token,
      };
      try {
        const res = await generateAWBAndShipmentAPI(allData);
        try {
          const response = res.response.response.data;
          const data = {
            privateAxios,
            orderId,
            shipRocketOrderId: response.order_id,
            shipRocketShipmentId: response.shipment_id,
            shipRocketTrackId: response.awb_code,
            shipRocketCourierId: courierId,
            shipRocketAWBId: response.awb_code,
          };
          const res2 = await orderSetShipRocketValues(data);
          adminGetAllOrders();
          setLoader(false);
          console.log("update courierId, AWBId Database", res2);
          // if (shiprocketRes.status === 200) {
          //   const shippedRes = await axiosShipRocket.post(
          //     `/external/courier/generate/pickup`,
          //     {
          //       shipment_id: shipmentID,
          //     },
          //     {
          //       headers: {
          //         'Content-Type': 'application/json',
          //         Authorization: `Bearer ${token}`,
          //       },
          //     }
          //   );

          //     if (shippedRes.status === 200) {
          //       toast(shippedRes.data.response.data);
          //       getShipRocketToken();
          //       dispacth(fetchAdminOrder(pageData));
          //     }
          //     // console.log("shippedRes=", shippedRes);
          //   }
        } catch (error) {
          console.log(error);
          setLoader(false);
          toast.error("Failed to generate AWB and shipment");
        }
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
    }
  };

  //cancel shipment................
  const cancelShipment = async (
    awb,
    orderId,
    shipRocketOrderId,
    shipRocketShipmentId
  ) => {
    setLoader(true);
    const awbs = [awb];
    const allData = { awbs, token, privateAxios };
    try {
      const res = await adminCancelShipment(allData);
      if (res.status === 200) {
        toast.success(res.data.message);
        const data = {
          privateAxios,
          orderId,
          shipRocketOrderId,
          shipRocketShipmentId,
          shipRocketTrackId: null,
          shipRocketCourierId: null,
          shipRocketAWBId: null,
        };
        await orderSetShipRocketValues(data);
        await adminGetAllOrders();
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  //cancel order...............
  const cancelOrder = async (shipRocketOrderId, orderId) => {
    const allData = { shipRocketOrderId, token };
    try {
      const res = await adminCancelOrder(allData);
      if (res.status === 200) {
        toast.success(res.data.message);
        const data = {
          privateAxios,
          orderId,
          shipRocketOrderId: null,
          shipRocketShipmentId: null,
          shipRocketTrackId: null,
          shipRocketCourierId: null,
          shipRocketAWBId: null,
        };
        const res2 = await orderSetShipRocketValues(data);
        const res3 = await adminProductStatusUpdate({
          privateAxios,
          orderId,
          status: "CANCELLED",
        });
        if (res3.status === 200) {
          console.log("hitttt");
        } else {
          console.log("not hit");
        }
        console.log(res2);
        await adminGetAllOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //schedule pickup.............
  const schedulePickup = async () => {
    setLoader(true);
    const allData = {
      privateAxios,
      pickup_date: [selectedDate.split("-").join("-")],
      shipment_id,
      token,
    };
    try {
      const res = await schedulePickupAPI(allData);
      if (res.status === 200) {
        toast.success(res.data.message);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      setPickupDialog(false);
      console.log(error);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId) => {
    const allData = {
      privateAxios,
      orderId,
      status: orderStatusChange,
    };
    console.log("allData", orderId, orderStatusChange);
    try {
      const res = await adminProductStatusUpdate(allData);
      if (res.status === 200) {
        toast.success("Order status updated successfully");
        adminGetAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    adminGetAllOrders();
  }, [filters.paymentStatus, currentPage, filters.status]);

  useEffect(() => {
    getShipRocketTokens();
  }, []);

  return (
    <>
      {/* Schedule Pickup */}
      <Modal
        okButtonProps={{
          style: { display: "none" },
        }}
        cancelButtonProps={{
          style: { display: "none" },
        }}
        open={pickupDialog}
        onCancel={() => setPickupDialog(false)}
        title="Schedule Pickup"
        width={400}
      >
        <div className="flex flex-col">
          <div className="flex flex-col">
            <input
              type="date"
              id="date"
              value={selectedDate}
              className=" input-border rounded-md p-2"
              onChange={(e) => setSelectedDate(e.target.value)}
              min={formatDate(today)}
              max={formatDate(maxDate)}
            />
            <p className="my-2">
              Selected Date: {selectedDate.split("-").reverse().join("-")}
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setPickupDialog(false)}
                className="cta px-4 py-2 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => schedulePickup()}
                className="cta px-4 py-2 rounded-md text-white"
              >
                Schedule Pickup
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Billing Address Modal */}
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
        {address != null && address.billingAddress.fullName}
        {<br />}
        <span className="font-semibold">Address: </span>
        {address != null && address.billingAddress.address}
        {<br />}
        <span className="font-semibold">City: </span>{" "}
        {address != null && address.billingAddress.city}
        {<br />}
        <span className="font-semibold">State: </span>
        {address != null && address.billingAddress.state}
        {<br />}
        <span className="font-semibold"> Pin Code: </span>{" "}
        {address != null && address.billingAddress.pincode}
        {<br />}
      </Modal>

      {/* Shipping Address Modal */}
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
        open={shippingAddressDialog}
        onOk={() => setShippingAddressDialog(false)}
        onCancel={() => setShippingAddressDialog(false)}
      >
        <span className="font-semibold">Name: </span>
        {address != null && address.billingAddress.fullName}
        {<br />}
        <span className="font-semibold">Address: </span>
        {address != null && address.billingAddress.address}
        {<br />}
        <span className="font-semibold">City: </span>{" "}
        {address != null && address.billingAddress.city}
        {<br />}
        <span className="font-semibold">State: </span>
        {address != null && address.billingAddress.state}
        {<br />}
        <span className="font-semibold"> Pin Code: </span>{" "}
        {address != null && address.billingAddress.pincode}
        {<br />}
      </Modal>

      <div>
        {/* heading */}
        <div className="w-max">
          <h4>All Orders</h4>
        </div>

        {/* filters */}
        <div className="flex w-full z-10 justify-between px-2 sticky top-12 py-8 bg-white items-center gap-3">
          <div className="flex w-max gap-3 justify-start items-center">
            <div className="relative float-label-input">
              <select
                type="text"
                id="status"
                name="status"
                placeholder=" "
                onChange={handleFilterChange}
                value={filters.status}
                className="block w-34 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
              >
                <option value="">Order Status</option>
                <option value="INPROCESS">In Process</option>
                <option value="ORDER_CONFIRM">Order Confirm</option>
                <option value="READY_TO_SHIP">Ready to Ship</option>
                <option value="SHIPPED">Shipped</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="RETURN">Return</option>
                <option value="REFUND">Refund</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="relative float-label-input">
              <select
                type="text"
                id="paymentStatus"
                name="paymentStatus"
                placeholder=" "
                onChange={handleFilterChange}
                value={filters.paymentStatus}
                className="block w-34 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
              >
                <option value="">Payment Status</option>
                <option value="DONE">Done</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div className="relative float-label-input">
              <select
                type="text"
                id="returnStatus"
                name="returnStatus"
                placeholder=" "
                onChange={handleFilterChange}
                value={filters.orderReturnRequest}
                className="block w-34 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
              >
                <option value="">Return Status</option>
                <option value="true">Requested</option>
                <option value="false">Not Requested</option>
              </select>
            </div>
          </div>
        </div>

        {/* order table */}
        <div className={`dashboard flex gap-4 overflow-scroll`}>
          <div className="flex-[100%]">
            <div className="mt-4 overflow-hidden ">
              <div className="overflow-hidden">
                <div className="w-full space-y-4 mt-4">
                  <div className="relative flex flex-col w-full h-full overflow-x-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                    {dataLoader ? (
                      <DataLoader />
                    ) : allOrders ? (
                      <table className="w-full z-0 text-left table-auto min-w-max">
                        {/* Header */}
                        <thead className="text-center">
                          <tr>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5"
                                //   checked={
                                //     isChecked.length === allProducts.length
                                //   }
                                //   onChange={handleAllCheck}
                                />
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Customer Name
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Order Status
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Payment Status
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Product Image
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Product Details
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
                                Confirm Order
                              </p>
                            </th>

                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Courier
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Schedule Pickup
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Status
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Exchanged
                              </p>
                            </th>
                          </tr>
                        </thead>

                        {/* table body */}
                        <tbody>
                          {allOrders &&
                            allOrders.map((item, index) => {
                              const shipmentID = item.shipRocketShipmentId;
                              return (
                                <tr
                                  key={index}
                                  className="border-b border-blue-gray-50"
                                >

                                  {/* checkbox */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <input
                                        // {...register('productId', {
                                        //   required: 'Please select Product!',
                                        // })}
                                        type="checkbox"
                                        className="w-5 h-5"
                                        name="productId"
                                      // onChange={() => handleCheck(item.id)}
                                      // checked={
                                      //   isChecked.length > 0 &&
                                      //   isChecked.includes(item.id)
                                      // }
                                      />
                                    </div>
                                  </td>

                                  {/* customer name */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.customer.fullName}
                                    </div>
                                  </td>

                                  {/* order status */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="flex items-center gap-2 font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.status}
                                      <div className="flex gap-2 items-center">
                                        <select
                                          className="px-2 py-1 input-border focus:outline-none rounded-full"
                                          name="orderStatus"
                                          id="orderStatus"
                                          onChange={(e) =>
                                            setOrderStatusChange(e.target.value)
                                          }
                                        >
                                          <option value="">
                                            Select Status
                                          </option>
                                          <option value="INPROCESS">
                                            INPROCESS
                                          </option>
                                          <option value="ORDER_CONFIRM">
                                            ORDER_CONFIRM
                                          </option>
                                          <option value="READY_TO_SHIP">
                                            READY_TO_SHIP
                                          </option>
                                          <option value="SHIPPED">
                                            SHIPPED
                                          </option>
                                          <option value="OUT_FOR_DELIVERY">
                                            OUT_FOR_DELIVERY
                                          </option>
                                          <option value="DELIVERED">
                                            DELIVERED
                                          </option>
                                          <option value="RETURN">RETURN</option>
                                          <option value="REFUND">REFUND</option>
                                          <option value="CANCELLED">
                                            CANCELLED
                                          </option>
                                        </select>
                                        <button
                                          onClick={() =>
                                            updateOrderStatus(item.id)
                                          }
                                          className="cta px-4 py-1 rounded-full text-white"
                                        >
                                          Update
                                        </button>
                                      </div>
                                    </div>
                                  </td>

                                  {/* payment status */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.paymentStatus &&
                                        item.paymentStatus === "PENDING" ? (
                                        <span className="text-yellow-900">
                                          {item.paymentStatus}
                                        </span>
                                      ) : item.paymentStatus === "DONE" ? (
                                        <span className="text-green-600">
                                          {item.paymentStatus}
                                        </span>
                                      ) : (
                                        <span className="text-red-600">
                                          {item.paymentStatus}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md leading-relaxed font-normal text-blue-gray-700">
                                      <img
                                        className="w-24 h-24 object-cover"
                                        src={item.productList.productImage[0]}
                                      />
                                    </div>
                                  </td>

                                  {/* product details */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <span className="font-semibold">
                                        Name:
                                      </span>{" "}
                                      {item.productList.productTitle}
                                      {<br />}
                                      <span className="font-semibold">
                                        Quantity:{" "}
                                      </span>
                                      {item.productQuantity}
                                      {<br />}
                                      <span className="font-semibold">
                                        Size:{" "}
                                      </span>
                                      {item.productStock.size}
                                      {" , "}
                                      <span className="font-semibold">
                                        Colour:{" "}
                                      </span>
                                      {item.productStock.color}
                                      {<br />}
                                      <span className="font-semibold">
                                        Price:{" "}
                                      </span>
                                      &#8377;
                                      {item.productList.afterDiscountPrice}
                                    </div>
                                  </td>

                                  {/* billing address */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <button
                                        onClick={() => {
                                          setAddress(item);
                                          setBillingAddressDialog(true);
                                        }}
                                        className="bg-[#b33601] text-white rounded-full px-4 py-1"
                                      >
                                        Show Billing Address
                                      </button>
                                    </div>
                                  </td>

                                  {/* show shipping address */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <button
                                        onClick={() => {
                                          setAddress(item);
                                          setShippingAddressDialog(true);
                                        }}
                                        className="bg-[#b33601] text-white rounded-full px-4 py-1"
                                      >
                                        Show Shipping Address
                                      </button>
                                    </div>
                                  </td>

                                  {/* Confirm Order */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      {item.status !== "CANCELLED" ? (
                                        item.paymentStatus === "DONE" ? (
                                          !item.shipRocketOrderId ? (
                                            <button
                                              onClick={() =>
                                                createNewOrder(item.id)
                                              }
                                              className="px-2 py-1 border border-green-600 text-green-600 rounded-full"
                                            >
                                              {loader ? (
                                                <ButtonLoader textColor="green" />
                                              ) : (
                                                "Confirm order"
                                              )}
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() =>
                                                cancelOrder(
                                                  item.shipRocketOrderId,
                                                  item.id
                                                )
                                              }
                                              disabled={
                                                item.shipRocketAWBId !== null
                                              }
                                              className="px-2 hover:text-white hover:bg-gray-600 py-1 border border-gray-600 text-gray-600 rounded-full"
                                            >
                                              {loader ? (
                                                <ButtonLoader textColor="gray" />
                                              ) : (
                                                "Cancel order"
                                              )}
                                            </button>
                                          )
                                        ) : (
                                          "Payment Pending"
                                        )
                                      ) : (
                                        "Order Cancelled"
                                      )}
                                    </div>
                                  </td>

                                  {/* Chck Courier */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <button
                                        onClick={() => {
                                          setSelectedOrderId(item.id);
                                          console.log("ITEM");
                                          console.log(item);
                                          getCourierAvail(202001, item.id);
                                        }}
                                        className="bg-[#b33601] text-white rounded-full px-4 py-1"
                                      >
                                        {loader ? (
                                          <ButtonLoader />
                                        ) : (
                                          "Check Courier"
                                        )}
                                      </button>
                                      {/* setting up courier */}
                                      <select
                                        className="cursor-pointer ml-5 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-full py-2 leading-normal"
                                        name=""
                                        value={courierId}
                                        onChange={(e) =>
                                          setCourierId(e.target.value)
                                        }
                                        id="couriorId"
                                      >
                                        <option value="">Select Courier</option>
                                        {selectedOrderId === item.id &&
                                          couriersList.length > 0 &&
                                          couriersList.map((item, index) => {
                                            return (
                                              <option
                                                key={index}
                                                value={item.courier_company_id}
                                              >
                                                {item.courier_name}
                                                {" | "}
                                                &#8377;
                                                {item.rate}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      <button
                                        onClick={() =>
                                          item.shipRocketAWBId === null
                                            ? generateAWBAndShipment(
                                              shipmentID,
                                              courierId,
                                              item.id
                                            )
                                            : cancelShipment(
                                              item.shipRocketAWBId,
                                              item.id,
                                              item.shipRocketOrderId,
                                              item.shipRocketShipmentId
                                            )
                                        }
                                        className={`${item.shipRocketAWBId !== null
                                          ? `ml-5 cursor-pointer text-red-600 border-red-600 hover:text-white hover:bg-red-600 border py-1 px-2 rounded-full`
                                          : courierId === ""
                                            ? `bg-gray-600  py-1 px-2 ml-5 text-white rounded-full`
                                            : `cta py-1 px-2 ml-5 text-white rounded-full`
                                          }`}
                                      >
                                        {item.shipRocketAWBId !== null ? (
                                          loader ? (
                                            <ButtonLoader textColor="red" />
                                          ) : (
                                            `Cancel Shipment`
                                          )
                                        ) : loader ? (
                                          <ButtonLoader />
                                        ) : (
                                          `Ship Now`
                                        )}
                                      </button>
                                    </div>
                                  </td>

                                  {/* Schedule Pickup */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <button
                                        disabled={item.shipRocketAWBId === null}
                                        onClick={() => {
                                          setShipment_id(
                                            item.shipRocketShipmentId
                                          );
                                          setPickupDialog(true);
                                        }}
                                        className={`px-4 py-1 rounded-full text-white ${item.shipRocketAWBId !== null
                                          ? "cta"
                                          : "bg-gray-600"
                                          }`}
                                      >
                                        Schedule Pickup
                                      </button>
                                    </div>
                                  </td>

                                  {/* Check status */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <button
                                        disabled={item.shipRocketAWBId === null}
                                        className={`bg-[#b33601] text-white rounded-full px-4 py-1 ${item.shipRocketAWBId !== null
                                          ? "cta"
                                          : "bg-gray-600"
                                          }`}
                                      >
                                        <Link
                                          to={`/dashboard/admin/courier/status/${item.shipRocketOrderId}/${item.shipRocketShipmentId}/${item.shipRocketAWBId}`}
                                        >
                                          Check Status
                                        </Link>
                                      </button>
                                    </div>
                                  </td>

                                  {/* Exchange Request */}
                                  <td className="px-2 py-2 border-2">
                                    <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                      <p className="">
                                        {item.orderReturnRequest
                                          ? "Requested"
                                          : "Not Requested"}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
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

        {/* pagination */}
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
    </>
  );
};

export default AdminGetAllOrders;
