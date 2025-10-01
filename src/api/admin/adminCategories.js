// import { all } from "axios";

//admin create categories api function call here..........................
export const adminCreateCategories = async (allData) => {
  const { privateAxios, data } = allData;
  return await privateAxios.post(`/admin/category/creation`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

//admin get all categories api function call here..........................
export const adminAllCategories = async (allData) => {
  const { privateAxios, search, page, active } = allData;
  return await privateAxios.get(`/admin/category/getAllCategories`, {
    params: { search, page, active: active ? active : null },
  });
};

//admin get categories by id api function call here..........................
export const adminCategoriesById = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.get(`/admin/category/admin/categorie/${id}`);
};

//admin update categories api function call here..........................
export const adminUpdateCategories = async (allData) => {
  const { privateAxios, catName, image, id } = allData;
  return await privateAxios.put(
    `/admin/category/admin/categorie/update/${id}`,
    {
      catName,
      image,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};

// status active inactive...............................................
export const categoryActiveInactive = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.patch(
    `/admin/category/admin/categorie/isActive/${id}`
  );
};

// admin delete categories api function call here..........................
export const adminDeleteCategories = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.delete(
    `/admin/category/admin/categorie/delete/${id}`,
    { id },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};
