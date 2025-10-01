import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { styled } from 'styled-components';
import { adminGetProductById, adminProductUpdate } from '../../api/admin/adminProductAPI';
import useAxiosPrivate from '../../hook/useAxiosPrivate';
import { AiFillDelete } from 'react-icons/ai';
import { ButtonLoader } from '../../components/general/ButtonLoader';
import { adminAllCategories } from '../../api/admin/adminCategories';

export const AdminUpdateProduct = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const privateAxios = useAxiosPrivate();
  const [stock, setStock] = useState([]);
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({
    categories: '',
    productTitle: '',
    description: '',
    price: '',
    styleCode: '',
    discountPercent: '',
    sku: '',
    fabric: '',
    wash: '',
    fit: '',
    'productImage[]': [],
    'thumbnail[]': '',
    'bannerImage[]': '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
  } = useForm();

  //updateStock..........................
  const updateStock = (data) => {
    setStock([...stock, data]);
    reset2();
  };

  //delete stock.........................
  const deleteStock = (index) => {
    setStock(stock.filter((item, ind) => ind !== index));
  };

  //get product details by id
  const getProductById = async () => {
    const allData = {
      privateAxios,
      productId: id,
    };
    try {
      const res = await adminGetProductById(allData);
      console.log('spectific product =', res);
      setProductDetails(res.data);
      setStock(res.data.ProductStock);
    } catch (error) {
      toast.error(error);
    }
  };

  //update product
  const updateProduct = async ({ categoriesId }) => {
    setLoader(true);
    const data = {
      categoriesId,
      productTitle: productDetails.productTitle,
      description: productDetails.description,
      price: productDetails.price,
      styleCode: productDetails.styleCode,
      discountPercent: productDetails.discountPercent,
      sku: productDetails.sku,
      fabric: productDetails.fabric,
      wash: productDetails.wash,
      fit: productDetails.fit,
      productStockList: stock,
      'productImage[]': productDetails['productImage[]'],
      'thumbnail[]': productDetails['thumbnail[]'],
      'bannerImage[]': productDetails['bannerImage[]'],
    };

    const allData = {
      privateAxios,
      id,
      data,
    };
    try {
      const res = await adminProductUpdate(allData);
      if (res.status === 200) {
        toast.success('Product Updated Successfully');
        getProductById();
        navigate('/dashboard/admin/all/product');
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  //getting all categories
  const getAllCategories = async () => {
    const allData = {
      privateAxios,
    };
    setLoader(true);
    try {
      const res = await adminAllCategories(allData);
      setAllCategory(res.data.getAllCategories);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleBannerUpload = (e) => {
    const files = e.target.files;
    console.log(files);
    setProductDetails({ ...productDetails, 'bannerImage[]': files[0] });
  };

  const handleThumbnailUpload = (e) => {
    const files = e.target.files;
    setProductDetails({ ...productDetails, 'thumbnail[]': files[0] });
  };

  const handleProductImagesUpload = (e) => {
    const files = e.target.files;
    setProductDetails({ ...productDetails, 'productImage[]': files });
  };

  useEffect(() => {
    getAllCategories();
    getProductById();
  }, []);

  return (
    <DashboardWrapper>
      <div className='mt-4'>
        <div>
          <div className='w-full overflow-hidden'>
            <div className='md:flex w-full'>
              <div className='w-full rounded-lg mx-auto px-5 md:px-10'>
                <div className='bg-white py-6 rounded-xl'>
                  <div className='space-y-6'>
                    <h1 className='text-center text-2xl font-semibold text-color'>
                      Update Product
                    </h1>
                    <hr />
                    <form onSubmit={handleSubmit2(updateStock)}>
                      <div>
                        <div className='grid grid-cols-4 gap-5'>
                          <div>
                            <div className='flex items-center input-border py-2 px-3 rounded-md'>
                              <svg
                                fill='#000000'
                                width='20px'
                                height='20px'
                                viewBox='0 0 1024 1024'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                                <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                                <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                              </svg>
                              <input
                                {...register2('color', {
                                  required: 'Please enter colour!',
                                })}
                                className='pl-2 outline-none border-none  w-full'
                                type='text'
                                name='color'
                                placeholder='Enter Color'
                              />
                            </div>
                            <p className='text-red-600 text-sm'>
                              {errors2.color?.message}
                            </p>
                          </div>
                          <div>
                            <div className='flex items-center input-border py-2 px-3 rounded-md'>
                              <svg
                                fill='#000000'
                                width='20px'
                                height='20px'
                                viewBox='0 0 1024 1024'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                                <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                                <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                              </svg>
                              <input
                                {...register2('size', {
                                  required: 'Please enter size!',
                                })}
                                className='pl-2 outline-none border-none  w-full'
                                type='text'
                                name='size'
                                placeholder='Enter Size'
                              />
                            </div>
                            <p className='text-red-600 text-sm'>
                              {errors2.size?.message}
                            </p>
                          </div>
                          <div>
                            <div className='flex items-center input-border py-2 px-3 rounded-md'>
                              <svg
                                fill='#000000'
                                width='20px'
                                height='20px'
                                viewBox='0 0 1024 1024'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                                <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                                <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                              </svg>
                              <input
                                {...register2('quantity', {
                                  required: 'Please enter Quantity!',
                                })}
                                className='pl-2 outline-none border-none  w-full'
                                type='text'
                                name='quantity'
                                placeholder='Enter Quality'
                              />
                            </div>
                            <p className='text-red-600 text-sm'>
                              {errors2.quantity?.message}
                            </p>
                          </div>
                          <button
                            type='submit'
                            value='update'
                            id='update'
                            className=' w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000'>
                            {loader ? <ButtonLoader /> : 'Update'}
                          </button>
                        </div>
                      </div>
                    </form>
                    {stock.length > 0 && (
                      <div className='w-2/3 mx-auto'>
                        <table className='w-full table-auto text-center text-color'>
                          <thead>
                            <tr>
                              <th className='input-border px-4 py-2'>Color</th>
                              <th className='input-border px-4 py-2'>Size</th>
                              <th className='input-border px-4 py-2'>
                                Quantity
                              </th>
                              <th className='input-border px-4 py-2'>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stock.map((item, index) => (
                              <tr key={index} id={index}>
                                <td className='input-border px-4 py-2'>
                                  {item.color}
                                </td>
                                <td className='input-border px-4 py-2'>
                                  {item.size}
                                </td>
                                <td className='input-border px-4 py-2'>
                                  {item.quantity}
                                </td>
                                <td className='input-border px-4 py-2'>
                                  <button
                                    onClick={() => {
                                      deleteStock(index);
                                    }}
                                    className='tooltip'>
                                    <AiFillDelete className='text-3xl text-red-600' />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <hr />
                    <form onSubmit={handleSubmit(updateProduct)}>
                      <div className='grid grid-cols-2 gap-5'>
                        <div className='relative float-label-input'>
                          <select
                            {...register('categoriesId', {
                              required: 'Please select categories name!',
                            })}
                            type='text'
                            id='name'
                            name='categoriesId'
                            className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-[0.6rem] leading-normal'>
                            <option value=''>Select Category</option>
                            {loader ? (
                              <option>Loading...</option>
                            ) : (
                              allCategory &&
                              allCategory.map((category, index) => (
                                <option
                                  key={index}
                                  selected={
                                    productDetails.categories.catName ==
                                    category.catName
                                  }
                                  value={category.id}>
                                  {category.catName}
                                </option>
                              ))
                            )}
                          </select>
                          <p className='text-red-600 text-sm'>
                            {errors.categoriesId?.message}
                          </p>
                        </div>
                        <div className='relative  '>
                          <select
                            {...register('type', {
                              required: 'Please select type is required!',
                            })}
                            type='text'
                            id='name'
                            placeholder=' '
                            className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2  leading-normal'>
                            <option value='Stitched'>Select Type</option>
                            <option value='Stitched'>Stitched</option>
                            <option value='Un-Stitched'>Un-Stitched</option>
                          </select>
                          <p className='text-red-600 text-sm'>
                            {errors.type?.message}
                          </p>
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='projectTitle'
                            placeholder='Product Title'
                            value={productDetails.productTitle}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                productTitle: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            value={productDetails.description}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                description: e.target.value,
                              })
                            }
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='description'
                            placeholder='Description'
                          />
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            value={productDetails.price}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                price: e.target.value,
                              })
                            }
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='price'
                            placeholder='Price'
                          />
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            value={productDetails.styleCode}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                styleCode: e.target.value,
                              })
                            }
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='styleCode'
                            placeholder='Style Code'
                          />
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            value={productDetails.discountPercent}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                discountPercent: e.target.value,
                              })
                            }
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='discountPercent'
                            placeholder='Discount Percent'
                          />
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            value={productDetails.sku}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                sku: e.target.value,
                              })
                            }
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='sku'
                            placeholder='SKU'
                          />
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            value={productDetails.fabric}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                fabric: e.target.value,
                              })
                            }
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='fabric'
                            placeholder='Fabric'
                          />
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            value={productDetails.wash}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                wash: e.target.value,
                              })
                            }
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='wash'
                            placeholder='Wash'
                          />
                        </div>
                        <div className='flex items-center input-border py-2 px-3 rounded-md'>
                          <svg
                            fill='#000000'
                            width='20px'
                            height='20px'
                            viewBox='0 0 1024 1024'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path d='M393.236 279.846c-6.051-12-15.966-21.915-27.965-27.966-77.229-38.955-152.35 36.165-113.386 113.4 6.049 11.997 15.962 21.907 27.965 27.951 77.227 38.964 152.348-36.153 113.386-113.386zM258.917 434.764c-20.89-10.519-38.026-27.651-48.559-48.539-59.17-117.288 58.575-235.031 175.857-175.872 20.885 10.531 38.016 27.661 48.548 48.546 59.169 117.289-58.58 235.03-175.846 175.864zm512.341-30.749c6.428 0 11.636-5.208 11.636-11.636V252.743c0-6.428-5.208-11.636-11.636-11.636H631.622c-6.428 0-11.636 5.208-11.636 11.636v139.636c0 6.428 5.208 11.636 11.636 11.636h139.636zm0 46.545H631.622c-32.135 0-58.182-26.047-58.182-58.182V252.742c0-32.135 26.047-58.182 58.182-58.182h139.636c32.135 0 58.182 26.047 58.182 58.182v139.636c0 32.135-26.047 58.182-58.182 58.182zm51.303 328.49c9.216 9.228 9.166 24.141-.112 33.307s-24.27 9.117-33.487-.112L600.799 623.829c-9.216-9.228-9.166-24.141.112-33.307s24.27-9.117 33.487.112L822.561 779.05z' />
                            <path d='M789.29 590.559c9.228-9.216 24.141-9.166 33.307.112s9.117 24.27-.112 33.487L634.069 812.321c-9.228 9.216-24.141 9.166-33.307-.112s-9.117-24.27.112-33.487L789.29 590.559zM446.871 794.517c10.952 21.724-3.673 45.163-28.15 45.163H226.398c-24.476 0-39.101-23.44-28.149-45.164l97.435-193.257c11.816-23.439 41.934-23.439 53.751 0l97.436 193.258zM322.56 654.576l-69.283 137.418h138.566L322.56 654.576z' />
                            <path d='M881.116 976.372c52.61 0 95.256-42.646 95.256-95.256V142.883c0-52.603-42.65-95.256-95.256-95.256H142.883c-52.606 0-95.256 42.653-95.256 95.256v738.233c0 52.61 42.646 95.256 95.256 95.256h738.233zm0 47.628H142.883C63.969 1024-.001 960.031-.001 881.116V142.883C-.001 63.977 63.972-.001 142.883-.001h738.233C960.027-.001 1024 63.977 1024 142.883v738.233C1024 960.03 960.031 1024 881.116 1024z' />
                          </svg>
                          <input
                            value={productDetails.fit}
                            onChange={(e) =>
                              setProductDetails({
                                ...productDetails,
                                fit: e.target.value,
                              })
                            }
                            className='pl-2 outline-none border-none  w-full'
                            type='text'
                            name='fit'
                            placeholder='Fit'
                          />
                        </div>
                      </div>
                      <div className='w-full mt-6 grid gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1'>
                        <div className='relative float-label-input'>
                          <input
                            {...register('bannerImage', {
                              required: 'Please select banner image!',
                            })}
                            onChange={(e) => handleBannerUpload(e)}
                            type='file'
                            id='name'
                            name='bannerImage[]'
                            placeholder=' '
                            className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
                          />
                          <label
                            htmlFor='name'
                            className='absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
                            Choose Product Banner
                          </label>
                          <p className='text-red-600 text-sm'>
                            {errors.bannerImage?.message}
                          </p>
                        </div>
                        <div className='relative float-label-input'>
                          <input
                            {...register('thumbnail', {
                              required: 'Please select thumbnail!',
                            })}
                            onChange={(e) => handleThumbnailUpload(e)}
                            name='thumbnail[]'
                            type='file'
                            id='name'
                            placeholder=' '
                            className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
                          />
                          <label
                            htmlFor='name'
                            className='absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
                            Choose Product Thumbnail
                          </label>
                          <p className='text-red-600 text-sm'>
                            {errors.thumbnail?.message}
                          </p>
                        </div>
                      </div>
                      <div className='w-full mt-6 grid gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 '>
                        <div className='relative float-label-input'>
                          <input
                            {...register('productImage', {
                              required: 'Please select product image!',
                            })}
                            onChange={(e) => handleProductImagesUpload(e)}
                            multiple
                            type='file'
                            id='name'
                            name='productImage[]'
                            placeholder=' '
                            className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
                          />

                          <label
                            htmlFor='name'
                            className='absolute top-3 left-0 text-sm text-color pointer-events-none transition duration-200 ease-in-outbg-white px-2 text-grey-darker'>
                            Choose Product Image
                          </label>
                          <p className='text-red-600 text-sm'>
                            {errors.productImage?.message}
                          </p>
                        </div>
                      </div>
                      <button
                        type='submit'
                        value='submit'
                        id='submit'
                        className='mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000'>
                        {loader ? <ButtonLoader /> : 'Update'}
                      </button>
                    </form>

                    {/* Remember Me checkbox */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div``;
