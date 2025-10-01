import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { useState } from "react";
import { adminCreateCategories } from "../../api/admin/adminCategories";
import { toast } from "react-toastify";
import { ButtonLoader } from "../../components/general/ButtonLoader";

export const AdminAddCategory = ({ getAllCategories, setAddCateModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const privateAxios = useAxiosPrivate();
  const [image, setImage] = useState("");
  console.log(image);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  //admin create categories api function call here..........................
  const createCategories = async (data) => {
    if (image == "") {
      setError("Please select image");
      return;
    } else {
      setError(null);
    }

    data = { ...data, image };
    const allData = { privateAxios, data };
    try {
      setLoader(true);
      const res = await adminCreateCategories(allData);
      if (res.status === 201) {
        toast.success("Category created successfully");
        getAllCategories();
        setAddCateModal(false);
        setLoader(false);
        reset();
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  return (
    <div>
      <div className="mt-4">
        <div>
          <div className="w-full overflow-hidden mt-4">
            <div className="md:flex w-full">
              <div className="w-full rounded-lg mx-auto px-5 md:px-10">
                <form onSubmit={handleSubmit(createCategories)}>
                  <div className="bg-white py-6 rounded-xl">
                    <div className="space-y-6">
                      <h1 className="text-center text-2xl font-semibold text-color">
                        Add Categories!
                      </h1>
                      <hr />
                      <div>
                        <div className="flex items-center input-border py-2 px-3 rounded-md">
                          <svg
                            fill="#000000"
                            width="20px"
                            height="20px"
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z" />
                            <path d="M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z" />
                            <path d="M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z" />
                          </svg>
                          <input
                            {...register("catName", {
                              required: "Please enter categories name!",
                            })}
                            className="pl-2 outline-none border-none  w-full"
                            type="text"
                            name="catName"
                            placeholder="Enter category name..."
                          />
                        </div>
                        <p className="text-red-600 text-sm">
                          {errors.catName?.message}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center input-border py-2 px-3 rounded-md ">
                          <svg
                            fill="#000000"
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M20,8.94a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19l-.09,0L13.06,2H7A3,3,0,0,0,4,5V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V9S20,9,20,8.94ZM14,5.41,16.59,8H14ZM18,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V5A1,1,0,0,1,7,4h5V9a1,1,0,0,0,1,1h5Z" />
                          </svg>
                          <input
                            onChange={(e) => setImage(e.target.files[0])}
                            className="pl-2 outline-none border-none w-full"
                            type="file"
                            name="email"
                            id=""
                            placeholder="Pick File"
                          />
                        </div>
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    </div>
                    {/* Remember Me checkbox */}
                    <button
                      type="submit"
                      value="login"
                      id="login"
                      className="mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000"
                    >
                      {loader ? <ButtonLoader /> : "Add Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
