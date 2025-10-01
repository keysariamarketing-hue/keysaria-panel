import { axiosShipRocket } from "../axios";

//get all orders..................
export const getAllOrders = async (allData) => {
  const {
    privateAxios,
    status,
    paymentStatus,
    page,
    pageSize,
    // orderReturnRequest,
    // orderReturnConfirm,
  } = allData;
  return await privateAxios.get('/admin/order/getAllOrders', {
    params: {
      status,
      paymentStatus,
      page,
      pageSize,
      // orderReturnRequest,
      // orderReturnConfirm,
    },
  });
};

//get shiprocket token..................
export const adminGetShipRocketToken = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get('/customer/myOrder/getShipRocketToken');
};

//create new order..................
export const createNewOrderForCourier = async (allData) => {
  const { privateAxios, orderId } = allData;
  return await privateAxios.get(`/admin/order/createNewOrder/${orderId}`);
};

//generateAWBAndShipment
export const generateAWBAndShipmentAPI = async (allData) => {
  const { shipmentID, courierId, token, privateAxios } = allData;
  try {
    const res = await privateAxios.post(`/admin/order/createShipment`, {
      shipmentID,
      courierId,
      token,
    });
    console.log('res', res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// get courier awail status
export const getCouierAwailStatus = async (allData) => {
  const { deliveryPin, token } = allData;
  return await axiosShipRocket.get(`external/courier/serviceability`, {
    params: {
      pickup_postcode: import.meta.env.VITE_PICKUP_PINCODE,
      delivery_postcode: deliveryPin,
      weight: 10,
      cod: 0,
      // order_id: order_id,
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

//cancel shipment...............
export const adminCancelShipment = async (allData) => {
  const { awbs, token } = allData;
  console.log('awbs', awbs);
  return await axiosShipRocket.post(
    `/external/orders/cancel/shipment/awbs`,
    {
      awbs,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//cancel order..............
export const adminCancelOrder = async (allData) => {
  const { shipRocketOrderId, token } = allData;
  return await axiosShipRocket.post(
    `external/orders/cancel`,
    {
      ids: [shipRocketOrderId],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//set shiprocket values for an order..................
export const orderSetShipRocketValues = async (allData) => {
  console.log('orderSetShipRocketValues', allData);
  const {
    privateAxios,
    orderId,
    shipRocketOrderId,
    shipRocketShipmentId,
    shipRocketTrackId,
    shipRocketCourierId,
    shipRocketAWBId,
  } = allData;
  return await privateAxios.patch('/admin/order/orderSetShipRocketValues', {
    orderId,
    shipRocketOrderId,
    shipRocketShipmentId,
    shipRocketTrackId,
    shipRocketCourierId,
    shipRocketAWBId,
  });
};

//admin Product Status Update......
export const adminProductStatusUpdate = async ({
  privateAxios,
  orderId,
  status,
}) => {
  console.log('orderId,status', orderId, status);
  return await privateAxios.patch(
    `/admin/order/adminProducts/productStatusUpdate`,
    {
      orderId,
      status,
    }
  );
};

//get shipment track..................
export const adminGetShipmentTrack = async (allData) => {
  const { privateAxios, token, awb_code } = allData;
  return await privateAxios.post('/admin/order/getShipmentTrack', {
    token,
    awb_code,
  });
};

//schedule pickup..................
export const schedulePickupAPI = async (allData) => {
  const { privateAxios, token, shipment_id, pickup_date } = allData;
  return await privateAxios.post('/admin/order/schedulePickup', {
    token,
    shipment_id,
    pickup_date,
  });
};

//generate menifest..................
export const generateMenifestAPI = async (allData) => {
  const { privateAxios, token, shipment_id } = allData;
  return await privateAxios.post('/admin/order/generateManifest', {
    token,
    shipment_id,
  });
};

//print menifest..................
export const printMenifestAPI = async (allData) => {
  const { privateAxios, token, shipment_id } = allData;
  return await privateAxios.post('/admin/order/printManifest', {
    token,
    shipment_id,
  });
};

//generate label..................
export const generateLabelAPI = async (allData) => {
  const { privateAxios, token, shipment_id } = allData;
  return await privateAxios.post('/admin/order/generateLabel', {
    token,
    shipment_id,
  });
};


// generate invoice
export const generateInvoice = async (allData) => {
  const { privateAxios, orderId, token } = allData;
  return await privateAxios.post(`/customer/myOrder/generateInvoice`, {
    orderId,
    token,
  });
};