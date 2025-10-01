import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { adminCreateCoupon, adminGetCouponById, adminRemoveCoupon, adminUpdateCoupon, admitGetAllCoupons } from "../../api/admin/adminCouponAPI";
import { Modal, Switch } from "antd";
import { IconButton } from "@material-tailwind/react";
import { MdDelete, MdEditSquare } from "react-icons/md";


const AdminManageCoupon = () => {
  const [addCouponModal, setAddCouponModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [updateCouponModal, setUpdateCouponModal] = useState(false);
  const [couponData, setCouponData] = useState({
    couponCode: '',
    discountAmount: undefined,
    discountInPercent: undefined,
    isActive: true,
  });
  const privateAxios = useAxiosPrivate();
  const [couponIdd, setCouponIdd] = useState(undefined);
  const [deleteModal, setDeleteModal] = useState(false);

  //create coupon................
  const createCoupon = async () => {
    // setLoader(true);
    const allData = {
      privateAxios,
      couponData,
    };

    try {
      // setLoader(false);
      adminCreateCoupon(allData);
    } catch (error) {
      // setLoader(false);
      console.log(error);
    }
  };

  //get all coupons.............
  const getAllCoupons = async () => {
    const allData = {
      privateAxios,
    };
    try {
      const res = await admitGetAllCoupons(allData);
      setCoupons(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  //update coupon...............
  const updateCoupon = async () => {
    const allData = { privateAxios, couponId: couponIdd, couponData };
    try {
      await adminUpdateCoupon(allData);
      setUpdateCouponModal(false);
      getAllCoupons();
      setCouponIdd(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  // get coupon by id.............
  const getCouponById = async (couponId) => {
    setUpdateCouponModal(true);
    setCouponIdd(couponId);
    const allData = { privateAxios, couponId };
    try {
      const res = await adminGetCouponById(allData);
      setCouponData({
        couponCode: res.data.couponCode,
        discountAmount: res.data.discountAmount,
        discountInPercent: res.data.discountInPercent,
        isActive: res.data.isActive,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  //remove coupon..............
  const removeCouponById = async () => {
    const allData = { privateAxios, couponId: couponIdd };
    try {
      const res = await adminRemoveCoupon(allData);
      if (res.status === 200) {
        getAllCoupons();
        setCouponIdd(undefined);
        setDeleteModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCoupons();
  }, []);

  return (
    <>
      <Modal
        open={deleteModal}
        centered
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setDeleteModal(false)}>
        <div>
          <h4 className='font-semibold'>
            Are you sure you want to delete this Coupon?
          </h4>
          <div className='flex gap-5'>
            <button
              type='submit'
              value='login'
              id='login'
              className='mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000'
              onClick={() => setDeleteModal(false)}>
              Cancel
            </button>
            <button
              type='submit'
              value='login'
              id='login'
              className='mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000'
              onClick={removeCouponById}>
              Yes
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        open={addCouponModal}
        centered
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setAddCouponModal(false)}>
        <div className='flex flex-col items-center'>
          <h4>Create Coupon</h4>
          <div className='relative float-label-input mt-5 w-1/2'>
            <input
              type='text'
              placeholder=''
              className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
              id='couponCode'
              name='couponCode'
              value={couponData.couponCode}
              onChange={(e) =>
                setCouponData({ ...couponData, couponCode: e.target.value })
              }
            />
            <label
              htmlFor='couponCode'
              className='absolute top-2 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
              Coupon Code
            </label>
          </div>
          <div className='relative float-label-input mt-5 w-1/2'>
            <input
              type='number'
              placeholder=''
              className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 appearance-none rounded-md py-2 leading-normal'
              id='discountAmount'
              name='discountAmount'
              value={couponData.discountAmount}
              onChange={(e) =>
                setCouponData({
                  ...couponData,
                  discountAmount:
                    e.target.value === '' ? undefined : e.target.value,
                  discountInPercent: undefined,
                })
              }
              disabled={couponData.discountInPercent !== undefined}
            />
            <label
              htmlFor='discountAmount'
              className='absolute top-2 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
              Discount Amount
            </label>
          </div>
          <div className='mt-2'>
            <p>OR</p>
          </div>
          <div className='relative float-label-input mt-2 w-1/2'>
            <input
              type='number'
              placeholder=''
              className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
              id='discountInPercent'
              name='discountInPercent'
              value={couponData.discountInPercent}
              onChange={(e) =>
                setCouponData({
                  ...couponData,
                  discountInPercent:
                    e.target.value === '' ? undefined : e.target.value,
                  discountAmount: undefined,
                })
              }
              disabled={couponData.discountAmount !== undefined}
            />
            <label
              htmlFor='discountInPercent'
              className='absolute top-2 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
              Discount In Percent
            </label>
          </div>
          <div className=' mt-5 w-1/2'>
            <div className='flex gap-5 w-full'>
              <p className='text-lg font-normal text-color'>Active</p>
              <div className='mr-5 flex items-center'>
                <Switch
                  color='blue'
                  value={couponData.isActive}
                  defaultChecked={couponData.isActive}
                  onClick={(e) => {
                    console.log(e.target);
                    setCouponData({
                      ...couponData,
                      isActive: !couponData.isActive,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={createCoupon}
            className='m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000'>
            Add
          </button>
        </div>
      </Modal>
      <Modal
        open={updateCouponModal}
        centered
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setUpdateCouponModal(false)}>
        <div className='flex flex-col items-center'>
          <h4>Update Coupon</h4>
          <div className='relative float-label-input mt-5 w-1/2'>
            <input
              type='text'
              placeholder=''
              className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
              id='couponCode'
              name='couponCode'
              value={couponData.couponCode}
              onChange={(e) =>
                setCouponData({ ...couponData, couponCode: e.target.value })
              }
            />
            <label
              htmlFor='couponCode'
              className='absolute top-2 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
              Coupon Code
            </label>
          </div>
          <div className='relative float-label-input mt-5 w-1/2'>
            {couponData.discountAmount !== null && (
              <>
                <input
                  type='number'
                  placeholder=''
                  className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 appearance-none rounded-md py-2 leading-normal'
                  id='discountAmount'
                  name='discountAmount'
                  value={couponData.discountAmount}
                  onChange={(e) =>
                    setCouponData({
                      ...couponData,
                      discountAmount: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor='discountAmount'
                  className='absolute top-2 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
                  Discount Amount
                </label>
              </>
            )}
            {couponData.discountInPercent !== null && (
              <>
                <input
                  type='number'
                  placeholder=''
                  className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
                  id='discountInPercent'
                  name='discountInPercent'
                  value={couponData.discountInPercent}
                  onChange={(e) =>
                    setCouponData({
                      ...couponData,
                      discountInPercent: e.target.value,
                    })
                  }
                />
                <label
                  htmlFor='discountInPercent'
                  className='absolute top-2 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
                  Discount In Percent
                </label>
              </>
            )}
          </div>
          <div className=' mt-5 w-1/2'>
            <div className='flex gap-5 w-full'>
              <p className='text-lg font-normal text-color'>Active</p>
              <div className='mr-5 flex items-center'>
                <Switch
                  color='blue'
                  value={couponData.isActive}
                  defaultChecked={couponData.isActive}
                  onClick={(e) => {
                    console.log(e.target);
                    setCouponData({
                      ...couponData,
                      isActive: !couponData.isActive,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={updateCoupon}
            className='m-5 w-1/2  shadow-xl bg-gradient-to-tr cta text-white py-2 flex justify-center items-center rounded-md text-lg tracking-wide transition duration-1000'>
            Add
          </button>
        </div>
      </Modal>
      <div className=''>
        <div className=''>
          <div className='w-full space-y-4 mt-4 pb-5'>
            <div className='flex w-full items-center  gap-3'>
              <div className='w-full flex items-center gap-2  '>
                <h4>All Coupons</h4>
                <button
                  onClick={() => setAddCouponModal(true)}
                  className='cta p-2 rounded-md text-white'>
                  Create New Coupon
                </button>
              </div>
            </div>
            <hr />
            <div className='grid grid-cols-5 gap-5'>
              {coupons.length > 0 ? (
                coupons.map((item, index) => (
                  <div
                    key={index}
                    className='w-52 h-52 shadow-lg bg-blue-gray-50 rounded-lg flex flex-col justify-center items-center'>
                    <h4>{item.couponCode}</h4>
                    <h5>{item.discountAmount && '₹' + item.discountAmount}</h5>
                    <h5>
                      {item.discountInPercent && item.discountInPercent + '%'}
                    </h5>
                    <div className='flex gap-4 mt-2'>
                      <IconButton className='bg-[#b33601]'>
                        <MdDelete
                          onClick={() => {
                            setCouponIdd(item.id);
                            setDeleteModal(true);
                          }}
                          className='text-2xl text-white'
                        />{' '}
                      </IconButton>
                      <IconButton className='bg-[#b33601]'>
                        <MdEditSquare
                          onClick={() => {
                            getCouponById(item.id);
                          }}
                          className='text-2xl text-white'
                        />{' '}
                      </IconButton>
                    </div>
                  </div>
                ))
              ) : (
                <h4>No Coupons</h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminManageCoupon;
