//get all orders..................
export const getAllNewOrders = async (allData) => {
    const {
        privateAxios,
        orderStatus,
        paymentStatus,
        page,
        pageSize,
    } = allData;
    return await privateAxios.get('/admin/order/v2/getAllOrders', {
        params: {
            orderStatus,
            paymentStatus,
            page,
            pageSize,
        },
    });
};

//admin Product Status Update......
export const adminProductOrderStatusUpdate = async ({
    privateAxios,
    orderId,
    status,
}) => {
    console.log('orderId,status', orderId, status);
    return await privateAxios.patch(
        `/admin/order/v2/adminProducts/productStatusUpdate`,
        {
            orderId,
            status,
        }
    );
};