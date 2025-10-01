import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import useLogout from "../hook/useLogout";
import { X, ToggleLeft, Menu } from "lucide-react";
import { AdminSidebar } from "../components/general/AdminSidebar";

export const DashboardRoute = () => {
  const { adminAuth, nav, setNav, setHeader } = useAuth();
  const navigate = useNavigate();
  let url = window.location.pathname;
  let str = url.split("/")[1];

  const user = adminAuth && adminAuth.result.fullName;
  const userName = user && user.split(" ")[0];

  const logout = useLogout();
  useEffect(() => {
    str === "dashboard" ? setHeader(true) : null;
  }, [str]);

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavbar = () => {
    setNav(!nav);
  };

  const mobileNavbar = () => {
    return (
      <div className="w-[65%] absolute z-20 block md:hidden bg-[#ffffff] h-screen lg:p-6 shadow">
        <AdminSidebar handleNavbar={handleNavbar} />
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block md:w-[20%] lg:w-[15%] z-50 h-full fixed bg-white shadow-md">
        <AdminSidebar />
      </div>
      {nav && mobileNavbar()}

      <div className="content-wrapper flex-1 md:ml-[20%] lg:ml-[20%] md:overflow-y-auto overflow-x-auto h-full">
        <div className="sticky top-0 left-0 z-20 bg-white p-4 flex flex-row justify-between items-center shadow">
          <h6 className="text-2xl  hidden md:block capitalize">
            Welcome, <span className="font-normal">{userName}</span>👋
          </h6>
          <button className="mr-4" onClick={signOut}>
            <span className="flex items-center gap-2 text-red-600">
              <ToggleLeft className="text-xl" />
              <h6>LogOut</h6>
            </span>
          </button>
          <h6 className="lg:text-2xl text-xl block md:hidden capitalize">
            Welcome, {userName} 👋
          </h6>
          <div
            className="cursor-pointer block md:hidden"
            onClick={handleNavbar}
          >
            {!nav ? <Menu /> : <X />}
          </div>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
