import { adminLogOut } from "../api/admin/adminAPI";
import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
  const privateAxios = useAxiosPrivate();
  const { setAdminAuth, setPersist, setHeader } = useAuth();
  
  const logout = async () => {
    const allData = { privateAxios };
    setAdminAuth({});
    setPersist(false);
    setHeader(false);
    try {
      await adminLogOut(allData);
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
