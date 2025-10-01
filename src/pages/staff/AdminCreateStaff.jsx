import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { adminGetAllRole } from "../../api/admin/adminRoleAPI";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { adminCreateStaffApi } from "../../api/admin/adminStaffAPI";

const AdminCreateStaff = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const privateAxios = useAxiosPrivate();
  const [loader, setLoader] = useState(false);
  const [allRole, setAllRole] = useState([]);

  //admin get role api call here.............
  const getAllRole = async () => {
    const allData = { privateAxios };
    try {
      const res = await adminGetAllRole(allData);
      // console.log(res.data);
      setAllRole(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //create staff api call here............
  const adminCreateStaff = async (data) => {
    const allData = {
      privateAxios,
      data,
    };
    try {
      const res = adminCreateStaffApi(allData);
      reset();
      console.log(res.message);
      toast.success("Staff added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRole();
  }, []);

  return (
    <>
      <div className={`dashboard flex gap-4`}>
        {/* main right side start */}
        <div className="col flex-[100%] p-4">
          <div className="mt-4">
            <div className=" flex flex-col items-center overflow-hidden mt-4 pb-20">
              <h1 className="text-center text-2xl font-semibold text-color">
                Add Staff
              </h1>
              <h4 className="text-color mt-5">Staff Details</h4>

              <form onSubmit={handleSubmit(adminCreateStaff)}>
                <div className="w-full  mx-auto">
                  <div className=" mt-6 grid gap-4 lg:lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 px-5">
                    <div className="relative float-label-input">
                      <select
                        {...register("roleId", {
                          required: "Please select Role!",
                        })}
                        type="text"
                        id="roleId"
                        name="roleId"
                        className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.6rem] leading-normal"
                      >
                        <option value="">Select Role</option>
                        {loader ? (
                          <option>Loading...</option>
                        ) : (
                          allRole &&
                          allRole.map((role, index) => (
                            <option key={index} value={role.id}>
                              {role.name}
                            </option>
                          ))
                        )}
                      </select>
                      <p className="text-red-600 text-sm">
                        {errors.roleId?.message}
                      </p>
                    </div>
                    <div className="relative float-label-input">
                      <input
                        {...register("fullName", {
                          required: "Please enter Staff name!",
                        })}
                        type="text"
                        id="fullName"
                        placeholder=""
                        name="fullName"
                        className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                      />
                      <label
                        htmlFor="staffName"
                        className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                      >
                        Staff Name
                      </label>
                      <p className="text-red-600 text-sm">
                        {errors.staffName?.message}
                      </p>
                    </div>
                  </div>
                  <div className="w-full mt-6 grid gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 px-5">
                    <div className="relative float-label-input">
                      <input
                        {...register("dob", {
                          required: "Please enter DoB!",
                        })}
                        type="date"
                        id="dob"
                        name="dob"
                        placeholder=""
                        className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                      />
                      <label
                        htmlFor="dob"
                        className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                      >
                        DoB
                      </label>
                      <p className="text-red-600 text-sm">
                        {errors.dob?.message}
                      </p>
                    </div>
                    <div className="relative float-label-input">
                      <input
                        {...register("phone", {
                          required: "Please enter phone number!",
                        })}
                        type="number"
                        id="phone"
                        placeholder=""
                        name="phone"
                        className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                      />
                      <label
                        htmlFor="phone"
                        className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                      >
                        Phone
                      </label>
                      <p className="text-red-600 text-sm">
                        {errors.phone?.message}
                      </p>
                    </div>
                  </div>
                  <div className="w-full mt-6 grid gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 px-5">
                    <div className="relative float-label-input">
                      <input
                        {...register("email", {
                          required: "Please enter email",
                        })}
                        type="text"
                        id="email"
                        name="email"
                        placeholder=" "
                        className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                      />
                      <label
                        htmlFor="email"
                        className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                      >
                        Email
                      </label>
                      <p className="text-red-600 text-sm">
                        {errors.email?.message}
                      </p>
                    </div>
                    <div className="relative float-label-input">
                      <select
                        {...register("gender", {
                          required: "Please select Role!",
                        })}
                        type="text"
                        id="gender"
                        name="gender"
                        className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.6rem] leading-normal"
                      >
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <p className="text-red-600 text-sm">
                        {errors.roleId?.message}
                      </p>
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-1 justify-center mt-8 px-5">
                    <button
                      type="submit"
                      value="login"
                      id="login"
                      className="w-2/4 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
                    >
                      {loader ? <ButtonLoader /> : "Add"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCreateStaff;
