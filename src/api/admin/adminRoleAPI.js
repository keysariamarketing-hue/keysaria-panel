//admin create role..............
export const adminCreateRole = async (allData) => {
  const { privateAxios, data } = allData;
  return await privateAxios.post('/role/createRoles', data);
};

//admin get all role..............
export const adminGetAllRole = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get('/role/getAllRoles');
};
