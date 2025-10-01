//get sandook by customer id............
export const getSandookByCustomerId = async (allData) => {
  const { privateAxios, customerId } = allData;
  if (customerId !== undefined) {
    return await privateAxios.get(
      `/sandook/getSandokByCustomerId/${customerId}`
    );
  }
};

//create sandook api...................................
export const createSandokAPI = async (allData) => {
  const { privateAxios, customerId } = allData;
  if (customerId !== undefined) {
    return await privateAxios.post(`/sandook/createSandok`, {
      customerId,
    });
  }
};

export const createSandookProduct = async (allData) => {
  const { privateAxios, sandokId, productId, productStockId, quantity } =
    allData;
  return await privateAxios.post(`/sandookProduct/createSandokProduct`, {
    sandokId,
    productId,
    productStockId,
    quantity,
  });
};

export const decrementSandookProductAPI = async (allData) => {
  const { privateAxios, sandokId, productId, productStockId } = allData;
  return await privateAxios.put(
    `/sandookProduct/decreaseFromSandookProductCart`,
    {
      sandokId,
      productId,
      productStockId,
    }
  );
};

//remove sandook products api call here....................
export const removeProductFromSandook = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.delete(`/sandookProduct/deleteSandokProduct/${id}`);
};

//create sandook order api...................................
export const createSandokOrder = async (allData) => {
  const {
    privateAxios,
    sandokId,
    billingAdressesId,
    shippingAddressId,
    date,
    timeSlotId,
  } = allData;
  return await privateAxios.post(`/sandookOrder/createSandokOrder`, {
    sandokId,
    billingAdressesId,
    shippingAddressId,
    date,
    timeSlotId,
  });
};

//delete sandook api call here............................
export const deleteSandook = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.delete(`/sandook/deleteSandok/${id}`);
};

//admin get all sandook orders...............................
export const adminGetAllSandookOrders = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get(`/sandookOrder/getAllSandokOrders`);
};

//admin set timeslots..............................
export const adminSetTimeslot = async (allData) => {
  const { privateAxios, slotName, maxOrders } = allData;
  return await privateAxios.post('/sandook/timeSlot/createTimeSlot', {
    slotName,
    maxOrders,
  });
};
//admin get all timeslots......................
export const adminGetAllTimeslot = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get('/sandook/timeSlot/getAllTimeSlots');
};

//delete timeslot......................
export const adminDeleteTimeslot = async (allData) => {
  const { privateAxios, timeSlotId } = allData;
  return await privateAxios.delete(
    `/sandook/timeSlot/deleteTimeSlot/${timeSlotId}`
  );
};

//get available timeslot................
export const availableTimeSlots = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get('/sandook/timeSlot/getAvailableTimeSlots');
};

//get timeslot by id...................
export const getSlotbyId = async (allData) => {
  const { privateAxios, timeSlotId } = allData;
  return await privateAxios.get(
    `/sandook/timeSlot/getAllTimeSlotsById/${timeSlotId}`
  );
};

//get sandook order by customer id...................
export const getSandookOrderByCustomerId = async (allData) => {
  const { privateAxios, customerId } = allData;
  return await privateAxios.get(
    `/sandookOrder/getSandokOrderByCustomerId/${customerId}`
  );
};

//get sandook order by id.....................
export const getSandookOrderBySandookId = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.get(`/sandookOrder/getSandokOrderById/${id}`);
};

//admin return sandook order....................
export const returnSandookOrderAPI = async (allData) => {
  const { privateAxios, orderId, returnedProducts } = allData;
  return await privateAxios.put(`/sandookOrder/updateSandokOrder`, {
    returnedProducts,
    orderId,
  });
};

//complete sandook return api....................
export const completeReturnAPI = async (allData) => {
  const { privateAxios, returnId } = allData;
  return await privateAxios.patch(`/return/complete/${returnId}`);
};

//cancel Sandook Order By Customer..............
export const cancelSandookOrderByCustomer = async (allData) => {
  const { privateAxios, orderId } = allData;
  return await privateAxios.patch(`/sandookOrder/cancelSanookOrder/${orderId}`);
};

//adminupdate order status.......................
export const adminUpdateSandookOrderStatus = async (allData) => {
  const { privateAxios, orderId, status } = allData;
  return await privateAxios.patch(`/sandookOrder/updateOrderStatus`, {
    orderId,
    status,
  });
};
