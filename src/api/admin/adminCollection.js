//admin create categories api function call here..........................
export const adminCreateCollection = async (allData) => {
    const { privateAxios, data } = allData;
    return await privateAxios.post(`/admin/collection/create`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
        },
    });
};

//admin get all categories api function call here..........................
export const adminAllCollection = async (allData) => {
    const { privateAxios, search, page, active } = allData;
    return await privateAxios.get(`/admin/collection`, {
        params: { search, page, active: active ? active : null },
    });
};

// admin delete collection api function call here..........................
export const adminDeleteCollection = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.delete(`/admin/collection/delete/${id}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};

// admin update collection api function call here..........................
export const adminUpdateCollection = async (allData) => {
  const { privateAxios, id, data } = allData;
  return await privateAxios.put(`/admin/collection/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  });
};