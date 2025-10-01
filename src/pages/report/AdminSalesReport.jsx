import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import { ButtonLoader } from "../../components/general/ButtonLoader";
import { DataLoader } from "../../components/general/DataLoader";

const AdminSalesReport = () => {
  const privateAxios = useAxiosPrivate();
  const [loader, setLoader] = useState(false);
  const [salesReport, setSalesReport] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [counter, setCounter] = useState(false);
  const [sandook, setSandook] = useState(false);

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
  };

  const reset = () => {
    setDateFrom("");
    setDateTo("");
    setCounter(!counter);
  };

  const getSalesReport = async () => {
    setLoader(true);
    try {
      const response = await privateAxios.get("/admin/report/sales-report", {
        params: {
          startDate: dateFrom,
          endDate: dateTo,
          sandok: sandook,
        },
      });
      setLoader(false);
      console.log(response);
      setTotalSales(response.data.salesReport.totalSales);
      setSalesReport(response.data.salesReport.detailedReport);
    } catch (error) {
      setLoader(false);
      console.error(error.message);
    }
  };

  useEffect(() => {
    getSalesReport();
  }, [counter, sandook]);

  return (
    <>
      <div className="flex justify-between items-center ">
        <h4>{sandook ? "Sandook" : "Product"} Sales Report</h4>
        <div>
          Total Sales:{" "}
          <span className="text-green-500 font-semibold">₹ {totalSales}</span>
        </div>
        <div className="flex items-center h-max space-x-2">
          <div className="">
            Date From:
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={handleDateFromChange}
              max={dateTo}
              className=" border p-1 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="">
            Date To:
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={handleDateToChange}
              min={dateFrom}
              className=" border p-1 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <div className="flex gap-2 items-center">
              <input
                value={sandook}
                onChange={() => setSandook(!sandook)}
                type="checkbox"
                className="w-4 h-4"
                name="sandook"
                id="sandook"
              />
              <label htmlFor="sandook">Sandook Orders</label>
              <button
                onClick={getSalesReport}
                className="cta px-4 py-2 text-white rounded-md"
              >
                {loader ? <ButtonLoader /> : "Submit"}
              </button>
              <button
                onClick={reset}
                className="cta px-4 py-2 text-white rounded-md"
              >
                {loader ? <ButtonLoader /> : "Reset"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-[100%]">
        <div className="mt-4 overflow-hidden ">
          <div className="overflow-hidden">
            <div className="w-full space-y-4 mt-4">
              <div className="relative flex flex-col w-full h-full overflow-x-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                {loader ? (
                  <DataLoader />
                ) : salesReport.length !== 0 ? (
                  <>
                    {salesReport && (
                      <table className="w-full z-0 text-left table-auto min-w-max">
                        <thead className="text-center">
                          <tr>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                S.No.
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Product Name
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Total Amount
                              </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                              <p className="block font-sans text-sm antialiased leading-none font-bold text-blue-gray-900 opacity-70">
                                Total Items Sold
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesReport.map((report, index) => (
                            <tr key={index} className="text-center">
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {report.productTitle}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {report.totalAmount}
                                </div>
                              </td>
                              <td className="px-2 py-2 border-2">
                                <div className="block font-sans text-md antialiased leading-relaxed font-normal text-blue-gray-700">
                                  {report.totalSoldItems || report.quantity}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500">No sales report available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSalesReport;
