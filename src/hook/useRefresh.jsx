import { adminRefereshAPI } from "../api/admin/adminAPI";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAdminAuth } = useAuth();
  
  // call refresh token api
  const refresh = async () => {
    const res = await adminRefereshAPI();
    console.log("response of auth refresh token  ", res);
    setAdminAuth((prev) => {
      return {
        ...prev,
        accessToken: res.data.accessToken,
        result: res.data.userDetails,
      };
    });
    return res.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
