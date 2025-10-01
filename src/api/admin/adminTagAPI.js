//create tag API..............
export const createTag = async (allData) => {
  const { privateAxios, tagName } = allData;
  return await privateAxios.post(`/tag/createTag`, { tagName });
};

//get all tags API............
export const getAllTagList = async (allData) => {
  const { privateAxios } = allData;
  return await privateAxios.get(`/tag/getAllTags`);
};

//apply tag to product API...............
export const adminApplyTag = async (allData) => {
  const { privateAxios, data } = allData;
  return await privateAxios.post(
    '/productTagging/taggingMultipleProducts',
    data
  );
};

export const adminRemoveTag = async (allData) => {
  const { privateAxios, data } = allData;
  return await privateAxios.patch();
};
