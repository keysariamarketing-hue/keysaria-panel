import { Link } from "react-router-dom";
import {
  UserCheck,
  Users,
  List,
  Package,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Percent,
  Grid,
} from "lucide-react";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { BiSync } from "react-icons/bi";

export const AdminDashboard = () => {
  const privateAxios = useAxiosPrivate();

  const [stats, setStats] = useState({
    staff: 0,
    customer: 0,
    categories: 0,
    collection: 0,
    product: 0,
    order: 0,
    cart: 0,
    wishList: 0,
    coupon: 0,
    exchangedProducts: 0,
  });

  // 2) Fetch the stats on component mount
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await privateAxios.get("/admin/dashboard");
        console.log("Dashboard stats:", response.data);
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchDashboardStats();
  }, []);

  const statisticsCardsData = [
    {
      title: "Staff",
      totalLogin: stats.staff,
      icon: <UserCheck className="text-4xl" />,
      link: "/dashboard/admin/all/staff",
      color: "gray",
      background: "#9F3E29",
    },
    {
      title: "Customer",
      totalLogin: stats.customer,
      icon: <Users className="text-4xl" />,
      link: "/dashboard/admin/all/customers",
      background: "#AC7B2A",
    },
    {
      title: "Categories",
      totalLogin: stats.categories,
      icon: <List className="text-4xl" />,
      color: "gray",
      link: "/dashboard/admin/all/categories",
      background: "#414B93",
    },
    {
      title: "Collections",
      totalLogin: stats.collection,
      icon: <Grid className="text-4xl" />,
      color: "gray",
      link: "/dashboard/admin/all/collections",
      background: "#414B93",
    },
    {
      title: "Product",
      totalLogin: stats.product,
      icon: <Package className="text-4xl" />,
      link: "/dashboard/admin/all/product",
      background: "#744781",
    },
    {
      title: "Orders",
      totalLogin: stats.order,
      icon: <ShoppingBag className="text-4xl" />,
      link: "/dashboard/admin/all/new-orders",
      background: "#348083",
    },
    {
      title: "Exchanges",
      totalLogin: stats.exchangedProducts,
      icon: <BiSync className="text-4xl" />,
      link: "/",
      background: "#348083",
    },
    {
      title: "Cart",
      totalLogin: stats.cart,
      icon: <ShoppingCart className="text-4xl" />,
      link: "",
      background: "#6A5261",
    },
    {
      title: "WishList",
      totalLogin: stats.wishList,
      icon: <Heart className="text-4xl" />,
      link: "",
      background: "#62662F",
    },
    {
      title: "Coupon",
      totalLogin: stats.coupon,
      icon: <Percent className="text-4xl" />,
      color: "gray",
      link: "/dashboard/admin/manage/coupon",
      background: "#717D7E",
    },
  ];
  return (
    <div>
      <div className="">
        <div className="col flex-[100%] p-4">
          <div className="mt-4">
            <div className="grid py-4 gap-10 md:grid-cols-2 xl:grid-cols-4">
              {statisticsCardsData.map((val, index) => {
                return (
                  <Link to={val.link} key={index}>
                    <div
                      style={{ backgroundColor: val.background }}
                      className="flex hover:shadow-xl text-white transition-all duration-200 items-center p-4 border-[1px] border-gray-500 bg-white rounded-lg shadow-xs"
                    >
                      <div className="p-3 mr-2 text-textColor bg-cta rounded-full dark:bg-green-500">
                        {val.icon}
                      </div>
                      <div>
                        <p className="mb-2 text-md font-bold">{val.title}</p>
                        <p className="text-md">{val.totalLogin}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
