import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Pages
import AdminSignIn from "./pages/AdminSignIn";
import AdminPersist from "./pages/AdminPersist";
import AdminRequireAuth from "./pages/AdminRequiredAuth";
import { DashboardRoute } from "./pages/DashboardRoute";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminAllCategory } from "./pages/category/AdminAllCategory";
import { AdminAddProduct } from "./pages/product/AdminAddProduct";
import { AdminAllProduct } from "./pages/product/AdminAllProduct";
import { AdminAllCustomers } from "./pages/customer/AdminAllCustomers";
import AdminGetAllOrders from "./pages/orders/AdminGetAllOrders";
import AdminCreateRole from "./pages/staff/AdminCreateRole";
import AdminCreateStaff from "./pages/staff/AdminCreateStaff";
import AdminAllStaff from "./pages/staff/AdminAllStaff";
import AdminAssignPermission from "./pages/staff/AdminAssignPermission";
import AdminSalesReport from "./pages/report/AdminSalesReport";
import AdminOrderCourierStatus from "./pages/orders/AdminOrderCourierStatus";
import AdminGetAllSandook from "./pages/orders/AdminGetAllSandook";
import AdminAllCollection from "./pages/category/AdminAllCollection";
import { AdminUpdateProduct } from "./pages/product/AdminUpdateProduct";
import ManageTags from "./pages/tags/ManageTags";
import AdminManageCoupon from "./pages/coupon/AdminManageCoupon";
import AdminAllNewOrders from "./pages/orders/AdminAllNewOrders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminSignIn />} />
        <Route path="/login" element={<AdminSignIn />} />
        <Route element={<AdminPersist />}>
          <Route element={<AdminRequireAuth />}>
            <Route element={<DashboardRoute />}>
              {/* Dashboard */}
              <Route path="/dashboard/admin" element={<AdminDashboard />} />

              {/* Category and Collection */}
              <Route
                path="/dashboard/admin/all/categories"
                element={<AdminAllCategory />}
              />
              <Route
                path="/dashboard/admin/all/collections"
                element={<AdminAllCollection />}
              />

              {/* Products */}
              <Route
                path="/dashboard/admin/add/product"
                element={<AdminAddProduct />}
              />
              <Route
                path="/dashboard/admin/all/product"
                element={<AdminAllProduct />}
              />
              <Route
                path="/dashboard/admin/update/product/:id"
                element={<AdminUpdateProduct />}
              />

              {/* Customers */}
              <Route
                path="/dashboard/admin/all/customers"
                element={<AdminAllCustomers />}
              />

              {/* Orders */}
              <Route
                path="/dashboard/admin/all/orders"
                element={<AdminGetAllOrders />}
              />
              <Route
                path="/dashboard/admin/all/new-orders"
                element={<AdminAllNewOrders />}
              />
              <Route
                path="/dashboard/admin/courier/status/:orderId/:shipment_id/:awbId"
                element={<AdminOrderCourierStatus />}
              />

              {/* Sandook */}
              <Route
                path="/dashboard/admin/all/sandook"
                element={<AdminGetAllSandook />}
              />

              {/* Tags */}
              <Route
                path="/dashboard/admin/manage/tags"
                element={<ManageTags />}
              />

              {/* Coupons */}
              <Route
                path="/dashboard/admin/manage/coupon"
                element={<AdminManageCoupon />}
              />

              {/* Sales Report */}
              <Route
                path="/dashboard/admin/salesReport"
                element={<AdminSalesReport />}
              />

              {/* Staff 4 options */}
              <Route
                path="/dashboard/admin/add/role"
                element={<AdminCreateRole />}
              />
              <Route
                path="/dashboard/admin/create/staff"
                element={<AdminCreateStaff />}
              />
              <Route
                path="/dashboard/admin/all/staff"
                element={<AdminAllStaff />}
              />
              <Route
                path="/dashboard/admin/assign/permission"
                element={<AdminAssignPermission />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
