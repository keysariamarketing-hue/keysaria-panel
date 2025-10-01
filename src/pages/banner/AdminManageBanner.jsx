import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { toast } from "react-toastify";
import { Modal, Switch } from "antd";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { adminAddBannerImage, adminDeleteBannerImage, adminGetBannerImage, adminUpdateBannerImage } from "../../api/admin/bannerAPI";

const AdminManageBanner = () => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const privateAxios = useAxiosPrivate();

  const adminGetAllBanner = async () => {
    const allData = {
      privateAxios,
    };
    try {
      const res = await adminGetBannerImage(allData);
      console.log(res);
      setBannerData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    adminGetAllBanner();
  }, []);

  const handleDeleteBanner = async (bannerId) => {
    const allData = {
      privateAxios,
      bannerId,
    };
    try {
      const res = await adminDeleteBannerImage(allData);
      console.log(res);
      adminGetAllBanner();
      setSelectedBanner(null);
      setDeleteDialog(false);
      toast.success(res.data.message);
    } catch (error) {
      setDeleteDialog(false);
      setSelectedBanner(null);
      toast.error('Banner not deleted');
      console.log(error);
    }
  };

  const handleStatus = async (bannerId) => {
    const allData = {
      privateAxios,
      bannerId,
    };
    try {
      const res = await adminUpdateBannerImage(allData);
      console.log(res);
      toast.success(res.data.message);
      adminGetAllBanner();
    } catch (error) {
      console.log(error);
      toast.error('Banner not updated');
      adminGetAllBanner();
    }
  };

  const [addBannerModal, setAddBannerModal] = useState(false);
  const [bannerImage, setImage] = useState(null);
  const [mobilebanner, setMobileBanner] = useState(null);

  const handleAddBanner = async () => {
    const allData = {
      privateAxios,
      bannerImage,
      mobilebanner,
    };
    try {
      setIsLoading(true);
      await adminAddBannerImage(allData);
      adminGetAllBanner();
      setAddBannerModal(false);
      setIsLoading(false);
      toast.success('Banner added successfully');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error('Banner not added');
    }
  };

  return (
    <>
      <Modal
        centered
        open={deleteDialog}
        onCancel={() => setDeleteDialog(false)}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}>
        <div className='mt-4'>
          <div className='w-full overflow-hidden mt-4'>
            <div className='md:flex w-full'>
              <div className='w-full rounded-lg mx-auto px-5 md:px-10'>
                <div className='bg-white w-full py-6 rounded-xl'>
                  <div className='space-y-6 '>
                    <h1 className='text-center text-2xl font-semibold text-color'>
                      Are you sure you want to delete
                    </h1>

                    <hr />
                    <div></div>
                  </div>
                  <div className=' flex justify-center '>
                    <button
                      onClick={() => setDeleteDialog(false)}
                      className='m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000'>
                      No
                    </button>
                    <button
                      type='submit'
                      value='delete'
                      id='delete'
                      onClick={() => handleDeleteBanner(selectedBanner)}
                      className='m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000'>
                      {isLoading ? <ButtonLoader /> : 'Yes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        centered
        open={addBannerModal}
        onCancel={() => setAddBannerModal(false)}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}>
        <div className='w-full overflow-hidden mt-4'>
          <div className='md:flex w-full'>
            <div className='w-full rounded-lg mx-auto px-5 md:px-10'>
              <div className='bg-white w-full py-6 rounded-xl'>
                <div className='space-y-6 '>
                  <h1 className='text-center text-2xl font-semibold text-color'>
                    Add Banner
                  </h1>
                  <hr />
                  <div className='flex justify-between '>
                    <label htmlFor='banner'>Large screen banner:</label>
                    <input
                      name='banner'
                      type='file'
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                  <div className='flex justify-between'>
                    <label htmlFor='mobilebanner'>Mobile screen banner:</label>
                    <input
                      name='mobilebanner'
                      type='file'
                      onChange={(e) => setMobileBanner(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className=' flex justify-center '>
                  <button
                    onClick={() => setAddBannerModal(false)}
                    className='m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000'>
                    Cancel
                  </button>
                  <button
                    type='submit'
                    value='delete'
                    id='delete'
                    onClick={() => handleAddBanner()}
                    className='m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000'>
                    {isLoading ? <ButtonLoader /> : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <div>
        <h1
          className='
        text-xl
      '>
          Admin Manage Banner
        </h1>
        <button
          onClick={() => setAddBannerModal(true)}
          className='cta py-2 px-4 rounded-lg text-white'>
          Add Banner
        </button>

        {bannerData && bannerData.length > 0 ? (
          <table className='w-full text-left table-auto min-w-max'>
            <thead>
              <tr>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  Banner Image(Large Device)
                </th>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  Banner Image(Smaller Device)
                </th>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  Is Active
                </th>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  Action
                </th>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {bannerData &&
                bannerData.map((banner, index) => (
                  <tr key={index} className='border-b border-blue-gray-50'>
                    <td className='p-4 border-2 '>
                      <p className='block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700'>
                        <img
                          onClick={() => {
                            window.open(banner.image, '_blank');
                          }}
                          className='cursor-pointer w-80 h-40 object-cover'
                          src={banner.image}
                        />
                      </p>
                    </td>
                    <td className='p-4 border-2 '>
                      <p className='block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700'>
                        <img
                          onClick={() => {
                            window.open(banner.mobilebanner, '_blank');
                          }}
                          className='cursor-pointer w-80 h-40 object-cover'
                          src={banner.mobilebanner}
                        />
                      </p>
                    </td>
                    <td className='p-4 border-2 '>
                      <p className='block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700'>
                        {banner.isActive ? (
                          <span className='text-green-500'>Active</span>
                        ) : (
                          <span className='text-red-500'>Inactive</span>
                        )}
                      </p>
                    </td>

                    <td className='p-4 border-2 '>
                      <p className='block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700'>
                        <Switch
                          onClick={() => handleStatus(banner.id)}
                          color='blue'
                          checked={banner.isActive}
                        />
                      </p>
                    </td>
                    <td className='p-4 border-2 '>
                      <div className='block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700'>
                        <button
                          onClick={() => {
                            setDeleteDialog(true);
                            setSelectedBanner(banner.id);
                          }}
                          className='bg-red-400 p-2 text-white rounded-md'>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className='flex justify-center items-center h-56 w-full'>
            No Banner Found
          </div>
        )}
      </div>
    </>
  );
};
export default AdminManageBanner;
