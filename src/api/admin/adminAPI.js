import { axiosPrivate } from '../axios';

//Admin logOut api...........................................................
export const adminLogOut = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.post(`/staffAuth/logout`, {
    withCredentials: true,
  });
};
//Admin login api...........................................................
export const adminAndStaffLogin = async (allData) => {
  const { privateAxios, data } = allData;
  return await privateAxios.post(`/staffAuth/login`, data);
};

//admin refresh API.........................................................
export const adminRefereshAPI = async () => {
  return await axiosPrivate.get(`/staffAuth/refresh`, {
    withCredentials: true,
  });
};
