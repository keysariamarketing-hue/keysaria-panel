import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useFilteration from "../../hook/useFilteration";
import {
  adminAssignPermission,
  adminGetAllStaff,
} from "../../api/admin/adminStaffAPI";
import { toast } from "react-toastify";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { routesList } from "../../RoutesList/routesList";
import useAxiosPrivate from "../../hook/useAxiosPrivate";

const AdminAssignPermission = () => {
  const [loader, setLoader] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { handleFilterChange, filters } = useFilteration();
  const [permissionSearch, setPermissionSearch] = useState("");
  const privateAxios = useAxiosPrivate();
  const [allStaff, setAllStaff] = useState([]);
  const [isChecked, setIsChecked] = useState([]);

  //get all staff..............
  const getAllStaff = async () => {
    const allData = {
      privateAxios,
    };
    try {
      const res = await adminGetAllStaff(allData);
      setAllStaff(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //assign permission..............
  const assignPermission = async (data) => {
    setLoader(true);
    console.log(data);
    let { staffId } = data;
    const allData = { privateAxios, staffId, data: isChecked };
    try {
      const res = await adminAssignPermission(allData);
      setLoader(false);
      if (res.status == 201) {
        toast.success("Permission Assigned");
        reset();
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  // Checkbox select all function..................
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setIsChecked(routesList);
    } else {
      setIsChecked([]);
    }
  };

  //handle Select
  const handleSelect = (e, item) => {
    if (e.target.checked) {
      setIsChecked((prevSelectedRoutes) => [...prevSelectedRoutes, item]);
    } else {
      setIsChecked((prevSelectedRoutes) =>
        prevSelectedRoutes.filter(
          (selectedRoute) => selectedRoute.name !== item.name
        )
      );
    }
  };

  const isRouteSelected = (routeName) =>
    isChecked.some((selectedRoute) => selectedRoute.name === routeName);

  useEffect(() => {
    console.log(isChecked);
  }, [isChecked]);

  useEffect(() => {
    getAllStaff();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(assignPermission)}>
        <div className="w-100 flex flex-col gap-10">
          <div className="flex w-100 justify-between gap-2 lg:gap-0">
            <div className="lg:w-1/4 w-1/2">
              <select
                {...register("staffId", {
                  required: "Please select Staff",
                })}
                type="text"
                id="staff"
                name="staffId"
                placeholder=" "
                onChange={handleFilterChange}
                value={filters.staffId}
                className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.65rem] leading-normal"
              >
                <option value="">Select Staff</option>
                {allStaff.map((staff, index) => {
                  return (
                    <option key={index} value={staff.id}>
                      {staff.fullName}
                    </option>
                  );
                })}
              </select>
              <p className="text-red-600 text-sm">{errors.staffId?.message}</p>
            </div>
            <div className="flex lg:w-3/4 w-1/2 justify-end gap-2">
              <div className="lg:w-1/4 w-1/2 relative float-label-input">
                <input
                  type="text"
                  id="search"
                  placeholder=""
                  value={permissionSearch}
                  onChange={(e) => setPermissionSearch(e.target.value)}
                  className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                />
                <label
                  htmlFor="seach"
                  className="absolute top-3 left-0 text-xs md:text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                >
                  Search Permissions
                </label>
              </div>
              <div className="lg:w-1/4 w-1/2">
                <button
                  type="submit"
                  name="assign"
                  className="w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
                >
                  {loader ? <ButtonLoader /> : "Assign"}
                </button>
              </div>
            </div>
          </div>
          <hr
            style={{
              height: "1px",
              borderWidth: "100%",
              backgroundColor: "gray",
            }}
          />
          <div className="w-max">
            <input
              type="checkbox"
              className="w-4 h-4 mr-2"
              onClick={handleSelectAll}
              checked={routesList.length == isChecked.length}
              name="selectAll"
            />
            <label htmlFor="selectAll">Select all permissions</label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-4">
            {routesList
              .filter((permission) =>
                permissionSearch === ""
                  ? permission
                  : permission.name
                      .toLowerCase()
                      .includes(permissionSearch.toLowerCase())
              )
              .map((item, index) => (
                <div className="w-max h-10" key={index}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2"
                    id={item.route}
                    name="routeName"
                    onClick={(e) => {
                      handleSelect(e, item);
                    }}
                    checked={isRouteSelected(item.name)}
                  />
                  <label htmlFor={item.route}>{item.name}</label>
                </div>
              ))}
          </div>
        </div>
      </form>
    </>
  );
};

export default AdminAssignPermission;
