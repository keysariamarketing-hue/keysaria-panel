import { Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { PersistLoader } from "../components/general/PersistLoader";

const AdminRequireAuth = () => {
  const { adminAuth } = useAuth();

  return adminAuth?.accessToken ? <Outlet /> : <PersistLoader />;
};

export default AdminRequireAuth;
