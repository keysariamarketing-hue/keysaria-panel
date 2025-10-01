export const adminAddBannerImage = async (allData) => {
  const { privateAxios, bannerImage, mobilebanner } = allData;
  return await privateAxios.post(
    '/banner/createBanner',
    {
      bannerImage,
      mobilebanner,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const adminGetBannerImage = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get('/banner/getBanner');
};

export const adminDeleteBannerImage = async (allData) => {
  const { privateAxios, bannerId } = allData;
  return await privateAxios.delete(`/banner/deleteBanner/${bannerId}`);
};

export const adminUpdateBannerImage = async (allData) => {
  const { privateAxios, bannerId, isActive } = allData;
  return await privateAxios.put(`/banner/updateBanner/${bannerId}`, {
    isActive,
  });
};
