import { useState } from "react";
import useAuth from "../hook/useAuth";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { adminAndStaffLogin } from "../api/admin/adminAPI";
import { toast } from "react-toastify";
import { ButtonLoader } from "../components/general/ButtonLoader";
import { Eye, EyeOff } from "lucide-react";

const AdminSignIn = () => {
  const { setAdminAuth } = useAuth();
  const privateAxios = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  //Admin login api...........................................................
  const loginAdmin = async (data) => {
    const allData = { privateAxios, data };
    try {
      setIsLoading(true);
      setLoader(true);
      const res = await adminAndStaffLogin(allData);
      if (res.status === 200) {
        setIsLoading(false);
        setLoader(false);
        setAdminAuth(res.data);
        setTimeout(() => {
          navigate(location.state || "/dashboard/admin");
        }, 200);
      }
      console.log(res);
    } catch (error) {
      toast.error(error.response?.data);
      console.log(error);
      setLoader(false);
      setIsLoading(false);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div>
      <div
        className="w-full px-4  mt-4 mx-auto py-10 pb-20"
        style={{ maxWidth: "800px" }}
      >
        <div className="md:flex w-full rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          <div className="w-full py-10 px-5 md:px-10">
            <form onSubmit={handleSubmit(loginAdmin)}>
              <div className="bg-white py-2 rounded-xl">
                <div className="space-y-2">
                  <h1 className="text-center mb-8 text-2xl font-semibold text-color">
                    Welcome Back to Login!
                  </h1>
                  <hr />
                  <div className="flex items-center input-border py-2 px-3 rounded-md mb-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#b33601"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <input
                      {...register("email", {
                        required: "Please enter email!",
                        pattern: /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
                      })}
                      autoComplete="off"
                      className="pl-2 outline-none border-none w-full"
                      type="email"
                      name="email"
                      id=""
                      placeholder="Email"
                    />
                  </div>
                  <p className="text-red-600 text-sm">
                    {errors.email?.message}
                    {errors.email && errors.email.type === "pattern" && (
                      <span>
                        Please enter correct format! rohitgold@hotmail.com
                      </span>
                    )}
                  </p>
                  <div className="mt py-4 pb-0">
                    <div className="flex  items-center input-border py-2 px-3 rounded-md ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-color"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        {...register("password", {
                          required: "Please enter password!",
                          // pattern:
                          //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                        })}
                        className="pl-2 outline-none border-none w-full"
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        id=""
                        placeholder="Password"
                      />
                      {isPasswordVisible ? (
                        <EyeOff onClick={handlePasswordVisibility} />
                      ) : (
                        <Eye onClick={handlePasswordVisibility} />
                      )}
                    </div>
                  </div>
                  <p className="text-red-600 text-sm">
                    {errors.password?.message}
                    {errors.password && errors.password.type === "pattern" && (
                      <span>
                        {" "}
                        Please enter correct format! Must contain at least one
                        number and one uppercase and lowercase letter, and at
                        least 6 or more characters{" "}
                      </span>
                    )}
                  </p>
                </div>
                {/* Remember Me checkbox */}
                <div className="flex justify-between items-center mt-8">
                  <p className="inline-flex items-center text-color font-medium text-xs text-center">
                    {/* <Link
                      to="/forgot/password"
                      onClick={() => setSignIn(false)}
                      className="text-xs ml-2 text-blue-500 font-semibold cursor-pointer"
                    >
                      Forgot Password &rarr;
                    </Link> */}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  value="login"
                  id="login"
                  className="mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000"
                >
                  {loader ? <ButtonLoader /> : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
