import { useEffect } from "react";
import useAuth from "./useAuth";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefresh";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { adminAuth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${adminAuth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // console.log("requestIntercept =>",requestIntercept);
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    // console.log("responseIntercept==>",responseIntercept)

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [adminAuth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
