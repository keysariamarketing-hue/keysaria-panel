import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useFilteration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query string for initial filter values and pagination
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialFullName = searchParams.get('fullName') || '';
  const initialStatus = searchParams.get('status') || '';
  const initialColor = searchParams.get('color') || '';
  const initialPrice = searchParams.get('price') || '';
  const initialCategoriesId = searchParams.get('categoriesId') || '';
  const initialStaffId = searchParams.get('staffId') || '';
  const initialRoleId = searchParams.get('roleId') || '';
  const initialPage = parseInt(searchParams.get('page')) || 1; // Default page 1
  const initialMinPrice = searchParams.get('minPrice') || undefined;
  const initialMaxPrice = searchParams.get('maxPrice') || undefined;
  const initialMinDiscount = searchParams.get('minDiscount') || undefined;
  const initialPaymentStatus = searchParams.get('paymentStatus') || '';
  const initialOrdeStatus = searchParams.get('orderStatus') || undefined;
  const initialType = searchParams.get('type') || undefined;

  const [filters, setFilters] = useState({
    search: initialSearch,
    fullName: initialFullName,
    status: initialStatus,
    color: initialColor,
    price: initialPrice,
    categoriesId: initialCategoriesId,
    staffId: initialStaffId,
    roleId: initialRoleId,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    minDiscount: initialMinDiscount,
    paymentStatus: initialPaymentStatus,
    orderStatus: initialOrdeStatus,
    type: initialType,
  });

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [debounce, setDebounce] = useState(initialSearch);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounce(filters.search);
    }, 500);
    return () => clearTimeout(timeOut);
  }, [filters.search]);

  // Update URL query string when filters or page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debounce) params.set('search', debounce);
    if (filters.fullName) params.set('fullName', filters.fullName);
    if (filters.status) params.set('status', filters.status);
    if (filters.color) params.set('color', filters.color);
    if (filters.price) params.set('price', filters.price);
    if (filters.categoriesId) params.set('categoriesId', filters.categoriesId);
    if (filters.staffId) params.set('staffId', filters.staffId);
    if (filters.roleId) params.set('roleId', filters.roleId);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minDiscount) params.set('minDiscount', filters.minDiscount);
    if (filters.orderStatus) params.set('orderStatus', filters.orderStatus);
    if (filters.type) params.set('type', filters.type);
    if (filters.paymentStatus)
      params.set('paymentStatus', filters.paymentStatus);
    if (currentPage !== 1) params.set('page', currentPage.toString());

    // Replace current URL with new query string
    navigate({ search: params.toString() }, { replace: true });
  }, [filters, debounce, currentPage, navigate]);

  // Handle input change for filters
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  // Clear all filters and reset page to 1
  const clearFilters = () => {
    setFilters({
      fullName: '',
      search: '',
      status: '',
      color: '',
      price: '',
      categoriesId: '',
      staffId: '',
      roleId: '',
      minPrice: undefined,
      maxPrice: undefined,
      minDiscount: undefined,
      paymentStatus: '',
      orderStatus: '',
      currentPage: 1,
      type: undefined,
    });
    setCurrentPage(1);
  };

  //previous page function .......................................
  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  //next page function ...........................................
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  //total page function ..........................................

  return {
    filters,
    currentPage,
    handleFilterChange,
    clearFilters,
    nextPage,
    previousPage,
    debounce,
  };
};

export default useFilteration;
