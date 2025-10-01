//create coupon.............
export const adminCreateCoupon = async (allData) => {
  const { privateAxios, couponData } = allData;
  const { couponCode, discountAmount, discountInPercent, isActive } =
    couponData;

  return await privateAxios.post(`/coupon/createCoupon`, {
    couponCode,
    discountAmount,
    discountInPercent,
    isActive,
  });
};

//get all coupons...............
export const admitGetAllCoupons = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get('/coupon/getAllCoupons');
};

//update coupon api.................
export const adminUpdateCoupon = async (allData) => {
  const { privateAxios, couponData, couponId } = allData;
  const { couponCode, discountAmount, discountInPercent, isActive } =
    couponData;
  return await privateAxios.put(`/coupon/updateCoupon/${couponId}`, {
    couponCode,
    discountAmount,
    discountInPercent,
    isActive,
  });
};

//get coupon by coupon id..............
export const adminGetCouponById = async (allData) => {
  const { privateAxios, couponId } = allData;
  return await privateAxios.get(`/coupon/getCouponById/${couponId}`);
};

//admin apply coupon to products.......
export const adminApplyCoupon = async (allData) => {
  const { privateAxios, data } = allData;
  const { productList, couponId } = data;
  return await privateAxios.put(`/coupon/applyCoupon`, {
    productList,
    couponId,
  });
};

//admin remove coupon..........
export const adminRemoveCoupon = async (allData) => {
  const { privateAxios, couponId } = allData;
  return await privateAxios.delete(`/coupon/deleteCoupon/${couponId}`);
};
