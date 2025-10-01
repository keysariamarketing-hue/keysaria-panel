import { useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { adminCreateRole } from "../../api/admin/adminRoleAPI";

const AdminCreateRole = () => {
  const privateAxios = useAxiosPrivate();
  const [loader, setLoader] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const adminAddRole = async (data) => {
    const allData = { privateAxios, data };
    try {
      setLoader(true);
      const res = await adminCreateRole(allData);
      if (res.status == 200) {
        reset();
        toast.success("Role added successfully");
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <>
      <div className={`dashboard flex gap-4`}>
        {/* main right side start */}
        <div className="col flex-[100%] p-4">
          <div className="mt-4">
            <div className=" flex flex-col items-center overflow-hidden mt-4 pb-20">
              <h1 className="text-center text-2xl font-semibold text-color">
                Add Role
              </h1>

              <form onSubmit={handleSubmit(adminAddRole)}>
                <div className="w-full  mx-auto">
                  <div className=" mt-6 grid gap-4 lg:lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 px-5">
                    <div className="relative float-label-input">
                      <input
                        {...register("name", {
                          required: "Please enter Role name!",
                        })}
                        type="text"
                        id="name"
                        placeholder=""
                        name="name"
                        className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                      />
                      <label
                        htmlFor="name"
                        className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                      >
                        Role Name
                      </label>
                      <p className="text-red-600 text-sm">
                        {errors.name?.message}
                      </p>
                    </div>
                    <div className="relative float-label-input">
                      <input
                        {...register("rank", {
                          required: "Please enter Rank!",
                        })}
                        type="number"
                        id="rank"
                        name="rank"
                        placeholder=""
                        className="block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal"
                      />
                      <label
                        htmlFor="rank"
                        className="absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker"
                      >
                        Rank
                      </label>
                      <p className="text-red-600 text-sm">
                        {errors.rank?.message}
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

export default AdminCreateRole;
