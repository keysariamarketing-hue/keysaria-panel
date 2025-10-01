import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import useRefreshToken from "../hook/useRefresh";
import { PersistLoader } from "../components/general/PersistLoader";
import { toast } from "react-toastify";

const AdminPersist = () => {
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useRefreshToken();
  const { adminAuth, persist } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
        toast.error("Please sign in to access the page!", {
          position: "top-right",
        });
        navigate("/login", { state: { from: location.pathname } });
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    // Avoids unwanted call to verifyRefreshToken
    !adminAuth?.accessToken && persist
      ? verifyRefreshToken()
      : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <PersistLoader /> : <Outlet />}</>
  );
};

export default AdminPersist;
