import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  LayoutDashboard,
  User,
  LogOut,
  UserPlus,
  Users,
  List,
  Package,
  PlusSquare,
  Percent,
  BarChart,
  UserCheck,
  Grid3X3,
  Boxes,
  PackagePlus,
} from "lucide-react";
import useAuth from "../../hook/useAuth";
import useLogout from "../../hook/useLogout";
import PropTypes from "prop-types";

export const adminRoutes = [
  //   {
  //     routeName: "Manage Banner",
  //     routeLink: "/dashboard/admin/manage/banner",
  //     icon: UserPlus,
  //   },
  {
    routeName: "All Categories",
    routeLink: "/dashboard/admin/all/categories",
    icon: List,
  },
  {
    routeName: "All Collection",
    routeLink: "/dashboard/admin/all/collections",
    icon: Grid3X3,
  },
  {
    routeName: "Add Product",
    routeLink: "/dashboard/admin/add/product",
    icon: PackagePlus,
  },
  {
    routeName: "All Product",
    routeLink: "/dashboard/admin/all/product",
    icon: Boxes,
  },
  {
    routeName: "All Customer",
    routeLink: "/dashboard/admin/all/customers",
    icon: User,
  },
  {
    routeName: "All Orders",
    routeLink: "/dashboard/admin/all/orders",
    icon: Truck,
  },
  {
    routeName: "All New Orders",
    routeLink: "/dashboard/admin/all/new-orders",
    icon: Truck,
  },
  {
    routeName: "All Sandooks",
    routeLink: "/dashboard/admin/all/sandook",
    icon: Package,
  },
  {
    routeName: "Sales Report",
    routeLink: "/dashboard/admin/salesReport",
    icon: BarChart,
  },
  // {
  //   routeName: "Manage Tags",
  //   routeLink: "/dashboard/admin/manage/tags",
  //   icon: Tag,
  // },
  {
    routeName: "Manage Coupons",
    routeLink: "/dashboard/admin/manage/coupon",
    icon: Percent,
  },
  {
    routeName: "Add Role",
    routeLink: "/dashboard/admin/add/role",
    icon: PlusSquare,
  },
  {
    routeName: "Add Staff",
    routeLink: "/dashboard/admin/create/staff",
    icon: UserPlus,
  },
  {
    routeName: "All Staff",
    routeLink: "/dashboard/admin/all/staff",
    icon: Users,
  },
  {
    routeName: "Assign Permission",
    routeLink: "/dashboard/admin/assign/permission",
    icon: UserCheck,
  },
];

export const AdminSidebar = ({ handleNavbar }) => {
  const { adminAuth } = useAuth();
  const adminName = adminAuth && adminAuth.result.fullName;
  const permitedRoutes = adminAuth && adminAuth.result.PermitedRoutes;
  const logout = useLogout();
  const navigate = useNavigate();

  const logoutAdmin = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <SideBarWrapper className="fixed nav-strip inset-0 h-[100vh] overflow-y-auto lg:w-72 transition-transform duration-300 xl:translate-x-0 shadow-lg bg-nav">
        <aside>
          <ul className="h-max flex flex-col lg:pb-32 items-stretch px-2 lg:px-0">
            <Link to="/dashboard/admin" className="pb-6">
              <li className="px-1">
                <div>
                  <User className="text-3xl" />
                </div>
                <h5>Hi, {adminName}</h5>
              </li>
            </Link>
            <Link to="/dashboard/admin" className="nav-hover">
              <li className="text-background px-1 py-2 md:py-0">
                <span>
                  <LayoutDashboard className="text-2xl" />
                </span>
                <h5>Dashboard</h5>
              </li>
            </Link>
            {adminName
              ? adminRoutes.map((route, index) => (
                <Link
                  key={index}
                  onClick={handleNavbar}
                  to={`${route.routeLink}`}
                  className="nav-hover"
                >
                  <li className="text-background px-1 py-2 md:py-0">
                    <span>
                      <route.icon className="text-2xl" />
                    </span>
                    <h5>{route.routeName}</h5>
                  </li>
                </Link>
              ))
              : permitedRoutes.map((permission, index) => (
                <Link
                  key={index}
                  to={`${permission.link}`}
                  className="nav-hover"
                >
                  <li className="text-background py-2 md:py-0 px-1">
                    <span>
                      <permission.icon className="text-2xl" />
                    </span>
                    <h5>{permission.name}</h5>
                  </li>
                </Link>
              ))}
            <Link onClick={logoutAdmin} className="nav-hover">
              <li className="text-background px-1 py-2 md:py-0">
                <span>
                  <LogOut className="text-2xl" />
                </span>
                <h5 className="rounded-lg">Logout</h5>
              </li>
            </Link>
          </ul>
        </aside>
      </SideBarWrapper>
    </>
  );
};

AdminSidebar.propTypes = {
  handleNavbar: PropTypes.func.isRequired,
};

const SideBarWrapper = styled.div`
  /* width: 250px; */
  height: 100vh;
  background: #1a1a1a; /* Dark grayish-black */
  color: #ffffff;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  transition: all 0.3s ease-in-out;

  aside {
    ul {
      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 12px 16px;
        border-radius: 8px;
        transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
        cursor: pointer;

        &:hover {
          background: #333333; /* Slight gray on hover */
          transform: translateX(4px);
        }

        h5 {
          font-size: 16px;
          font-weight: 500;
        }

        span {
          font-size: 20px;
          color: #ccc; /* Light gray icon color */
        }
      }
    }
  }

  @media (max-width: 768px) {
    /* width: 200px; Adjust width for smaller screens */
    ul {
      li {
        padding: 10px;
        text-align: center;
      }
    }
  }
`;
