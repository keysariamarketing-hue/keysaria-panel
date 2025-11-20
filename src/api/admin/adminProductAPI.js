//admin create product api function call here..........................
export const adminCreateProduct = async (allData) => {
  const { privateAxios, data } = allData;
  console.log('data: ', data);

  return await privateAxios.post(
    `/admin/product/createNewProduct`,
    data, // Pass FormData directly, don't spread it
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

export const adminCreateProductBulk = async (allData) => {
  const { privateAxios, data } = allData;
  return await privateAxios.post(
    `/admin/product/createBulkProducts`,
    { data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

//admin get all product api function call here..........................
export const adminGetAllProduct = async (allData) => {
  const { privateAxios, active, search, page, pageSize, categories, minPrice, maxPrice } =
    allData;
  return await privateAxios.get(`/admin/product/getAllProductsList`, {
    params: {
      search,
      page,
      pageSize,
      categories,
      active: active ? active : null,
      minPrice: minPrice,
      maxPrice: maxPrice,
    },
  });
};

//product active in active.............
export const productActiveInactive = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.patch(`/admin/product/deactivateProduct/${id}`);
};

//admin toggle featured product api................
export const updateFeaturedProduct = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.patch(`admin/product/featuredToggle/${id}`);
};

//admin get product by product id...........
export const adminGetProductById = async (allData) => {
  const { privateAxios, productId } = allData;
  return await privateAxios.get(`admin/product/getProduct/${productId}`);
};

//admin update product..............
export const adminProductUpdate = async (allData) => {
  const { privateAxios, id, data } = allData;
  console.log(data);
  return await privateAxios.patch(
    `/admin/product/updateProduct/${id}`,
    { ...data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

//admin delete product ..............
export const adminDeleteProduct = async (allData) => {
  const { privateAxios, id } = allData;
  return await privateAxios.delete(`admin/product/deleteProduct/${id}`);
};
