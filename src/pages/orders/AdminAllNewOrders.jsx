import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import useFilteration from "../../hook/useFilteration";
import { adminProductOrderStatusUpdate, getAllNewOrders } from "../../api/admin/adminOrdersV2";
import { toast } from "react-toastify";
import { adminGetShipRocketToken } from "../../api/admin/adminOrdersAPI";
import { Link } from "react-router-dom";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { DataLoader } from "../../components/general/DataLoader";
import { Modal } from "antd";

const AdminAllNewOrders = () => {
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

    const formatISODate = (isoString) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        return new Date(isoString).toLocaleString('en-US', options);
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
            orderStatus: filters.orderStatus,
            paymentStatus: filters.paymentStatus,
            page: currentPage,
            pageSize: 20,
        };
        try {
            setDataLoader(false);
            const res = await getAllNewOrders(alldata);
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

    // Update order status
    const updateOrderStatus = async (orderId) => {
        const allData = {
            privateAxios,
            orderId,
            status: orderStatusChange,
        };
        console.log("allData", orderId, orderStatusChange);
        try {
            const res = await adminProductOrderStatusUpdate(allData);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.paymentStatus, currentPage, filters.orderStatus]);

    useEffect(() => {
        getShipRocketTokens();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* Schedule Pickup */}


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
                                id="orderStatus"
                                name="orderStatus"
                                placeholder=" "
                                onChange={handleFilterChange}
                                value={filters.orderStatus}
                                className="block w-34 input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
                            >
                                <option value="">Order Status</option>
                                <option value="INPROCESS">In Process</option>
                                <option value="ORDER_CONFIRM">Order Confirm</option>
                                <option value="READY_TO_SHIP">Ready to Ship</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="EXCHANGE_REQUESTED">Exchange Requested</option>
                                <option value="EXCHANGED">Exchanged</option>
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
                                                        {/* <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
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
                                                        </th> */}
                                                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                                                Ordered On
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
                                                                Product Details
                                                            </p>
                                                        </th>
                                                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                                                Sub Total
                                                            </p>
                                                        </th>
                                                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                                                Coupon Applied
                                                            </p>
                                                        </th>
                                                        <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                                            <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                                                Billed Total
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
                                                            return (
                                                                <tr
                                                                    key={index}
                                                                    className="border-b border-blue-gray-50 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                                                                >
                                                                    {/* <td className="px-2 py-2 border-2">
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
                                                                    </td> */}

                                                                    {/* Ordered On */}
                                                                    <td className="px-2 py-2 border-2">
                                                                        <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                            {formatISODate(item.orderOn)}
                                                                        </div>
                                                                    </td>

                                                                    {/* Customer Name */}
                                                                    <td className="px-2 py-2 border-2">
                                                                        <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                            {item.customer.fullName}
                                                                        </div>
                                                                    </td>

                                                                    {/* Order Status */}
                                                                    <td className="px-2 py-2 border-2">
                                                                        <div className="flex items-center gap-2 font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                            {item.orderStatus}
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

                                                                                    <option value="EXCHANGE_REQUESTED">
                                                                                        EXCHANGE_REQUESTED
                                                                                    </option>
                                                                                    <option value="EXCHANGED">
                                                                                        EXCHANGED
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

                                                                    {/* Payment Status */}
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
                                                                        <span>({item.modeOfPayment})</span>
                                                                    </td>

                                                                    {/* Product Quantity */}
                                                                    <td className="px-2 py-2 border-2">
                                                                        {item.orderItems.map((orderItem, index) => {
                                                                            return (
                                                                                <div key={index} className="flex flex-col gap-y-2">
                                                                                    <div className="flex gap-x-2">
                                                                                        {/* Product Image */}
                                                                                        <div className="block font-sans text-md leading-relaxed font-normal text-blue-gray-700">
                                                                                            <img className="w-24 h-24 object-cover" src={orderItem.product.thumbnail} />
                                                                                        </div>

                                                                                        {/* Product Details */}
                                                                                        <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                                            <span className="font-semibold">Name: </span>{orderItem.product.productTitle}
                                                                                            <br />
                                                                                            <span className="font-semibold">Quantity: </span>{orderItem.productQuantity}
                                                                                            <br />
                                                                                            <span className="font-semibold">Size: </span>{orderItem.productStock.size}{" , "}
                                                                                            <span className="font-semibold">Colour: </span>{orderItem.productStock.color}
                                                                                            <br />
                                                                                            <span className="font-semibold">Price: </span>&#8377;{orderItem.product.afterDiscountPrice}
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Line between products except last one */}
                                                                                    {index !== item.orderItems.length - 1 && <hr className="border-t border-gray-300 my-2" />}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </td>

                                                                    {/* Final Total */}
                                                                    <td className="px-2 py-2 border-2">
                                                                        <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                            {item.subTotal}
                                                                        </div>
                                                                    </td>

                                                                    {/* Coupon Applied */}
                                                                    <td className="px-2 py-2 border-2">
                                                                        <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                            Coupon: {item.couponApplied ? <span className="font-bold" >{item.couponApplied.couponCode}</span> : "No Coupon Applied"}
                                                                        </div>
                                                                        {
                                                                            item.couponApplied && <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                                Discount: {item.subTotal - item.finalTotal}
                                                                            </div>
                                                                        }

                                                                    </td>

                                                                    {/* Billed Total */}
                                                                    <td className="px-2 py-2 border-2">
                                                                        <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                            {item.finalTotal}
                                                                        </div>
                                                                    </td>

                                                                    {/* Show Billing Address */}
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

                                                                    {/* Show Shipping Address */}
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


                                                                    <td className="px-2 py-2 border-2">
                                                                        <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                            {item.status !== "CANCELLED" ? (
                                                                                item.paymentStatus === "DONE" ? (
                                                                                    !item.shipRocketOrderId ? (
                                                                                        <button
                                                                                            // onClick={() =>
                                                                                            //     createNewOrder(item.id)
                                                                                            // }
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
                                                                                            // onClick={() =>
                                                                                            //     cancelOrder(
                                                                                            //         item.shipRocketOrderId,
                                                                                            //         item.id
                                                                                            //     )
                                                                                            // }
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
                                                                    <td className="px-2 py-2 border-2">
                                                                        <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedOrderId(item.id);
                                                                                    console.log("ITEM");
                                                                                    console.log(item);
                                                                                    // getCourierAvail(202001, item.id);
                                                                                }}
                                                                                className="bg-[#b33601] text-white rounded-full px-4 py-1"
                                                                            >
                                                                                {loader ? (
                                                                                    <ButtonLoader />
                                                                                ) : (
                                                                                    "Check Courier"
                                                                                )}
                                                                            </button>
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
                                                                                // onClick={() =>
                                                                                //     item.shipRocketAWBId === null
                                                                                //         ? generateAWBAndShipment(
                                                                                //             shipmentID,
                                                                                //             courierId,
                                                                                //             item.id
                                                                                //         )
                                                                                //         : cancelShipment(
                                                                                //             item.shipRocketAWBId,
                                                                                //             item.id,
                                                                                //             item.shipRocketOrderId,
                                                                                //             item.shipRocketShipmentId
                                                                                //         )
                                                                                // }
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
    )
}

export default AdminAllNewOrders