//admin customer API

//admin get all customers api function call here..........................
export const adminGetAllCustomer = async (allData) => {
  const { privateAxios, active, fullName, page } = allData;
  return await privateAxios.get(`/admin/customer/getAllCustomers`, {
    params: { fullName, page, active: active ? active : null },
  });
};

//admin set active inactive customer api function call here..........................
export const customerActiveInactive = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.put(`/admin/customer/activeInactive/${id}`);
};
