//admin create staff.............
export const adminCreateStaffApi = async (allData) => {
  const { privateAxios, data } = allData;
  return await privateAxios.post('staffAuth/register', data);
};

// admin get all staff............
export const adminGetAllStaff = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get('/staff/getAllStaff');
};

//admin update active status............
export const staffActiveInactive = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.patch(`/staff/deactivateStaff/${id}`);
};

//admin assign permission to staff............
export const adminAssignPermission = async (allData) => {
  const { privateAxios, staffId, data } = allData;
  return await privateAxios.post('/permission/createPermissions', {
    data,
    staffId,
  });
};
