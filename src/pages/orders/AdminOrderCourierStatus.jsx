import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hook/useAxiosPrivate";
import {
  adminGetShipmentTrack,
  adminGetShipRocketToken,
  generateInvoice,
  generateLabelAPI,
  generateMenifestAPI,
  printMenifestAPI,
} from "../../api/admin/adminOrdersAPI";
import { toast } from "react-toastify";
import { DataLoader } from "../../components/general/DataLoader";

const AdminOrderCourierStatus = () => {
  const [loader, setLoader] = useState(true);
  const [token, setToken] = useState("");
  const [generatedManifest, setGeneratedManifest] = useState(false);
  const privateAxios = useAxiosPrivate();
  const { shipment_id, awbId, orderId } = useParams();

  const awb_code = awbId;
  //get shiprocket token......................
  const getShipRocketToken = async () => {
    const allData = { privateAxios };
    try {
      const res = await adminGetShipRocketToken(allData);
      setToken(res.data);
      getShimentTrack(res.data);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  //generate menifest.................
  const generateMenifestFunc = async () => {
    const allData = { privateAxios, token, shipment_id: [shipment_id] };
    try {
      const res = await generateMenifestAPI(allData);
      toast.success("Menifest generated for this shipment");
      console.log("res", res);
      setGeneratedManifest(true);
    } catch (error) {
      if (error.response.status === 400) {
        toast.success("Menifest generated for this shipment");
        setGeneratedManifest(true);
      }
      console.log(error);
    }
  };

  //print menifest.................
  const printMenifestFunc = async () => {
    const allData = { privateAxios, token, shipment_id: [shipment_id] };
    try {
      const res = await printMenifestAPI(allData);
      console.log("res", res.data.response.manifest_url);
      if (res.data.response) {
        const pdfUrl = res.data.response.manifest_url;

        const link = document.createElement("a");
        link.href = pdfUrl;
        // link.download = 'shiprocket-manifest.pdf'; // Optional: Customize the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get shipment track......................
  const [trackData, setTrackData] = useState();
  const [trackActivity, setTrackActivity] = useState([
    {
      date: "2022-07-19 11:37:00",
      status: "DLVD",
      activity: "Delivered",
      location: "MADANPALLI, Madanapalli, ANDHRA PRADESH",
      "sr-status": "7",
      "sr-status-label": "DELIVERED",
    },
    {
      date: "2022-07-19 08:57:00",
      status: "OFD",
      activity:
        "Out for Delivery Out for delivery: 383439-Nandinayani Reddy Bhaskara Sitics Logistics  (356231) (383439)-PDS22200085719383439-FromMob , MobileNo:- 9963133564",
      location: "MADANPALLI, Madanapalli, ANDHRA PRADESH",
      "sr-status": "17",
      "sr-status-label": "OUT FOR DELIVERY",
    },
    {
      date: "2022-07-19 07:33:00",
      status: "RAD",
      activity:
        "Reached at Destination Shipment BagOut From Bag : nxbg03894488",
      location: "MADANPALLI, Madanapalli, ANDHRA PRADESH",
      "sr-status": "38",
      "sr-status-label": "REACHED AT DESTINATION HUB",
    },
    {
      date: "2022-07-18 21:02:00",
      status: "IT",
      activity: "InTransit Shipment added in Bag nxbg03894488",
      location: "BLR/FC1, BANGALORE, KARNATAKA",
      "sr-status": "18",
      "sr-status-label": "IN TRANSIT",
    },
    {
      date: "2022-07-18 20:28:00",
      status: "PKD",
      activity: "Picked Shipment InScan from Manifest",
      location: "BLR/FC1, BANGALORE, KARNATAKA",
      "sr-status": "6",
      "sr-status-label": "SHIPPED",
    },
    {
      date: "2022-07-18 13:50:00",
      status: "PUD",
      activity: "PickDone ",
      location: "RTO/CHD, BANGALORE, KARNATAKA",
      "sr-status": "42",
      "sr-status-label": "PICKED UP",
    },
    {
      date: "2022-07-18 10:04:00",
      status: "OFP",
      activity: "Out for Pickup ",
      location: "RTO/CHD, BANGALORE, KARNATAKA",
      "sr-status": "19",
      "sr-status-label": "OUT FOR PICKUP",
    },
    {
      date: "2022-07-18 09:51:00",
      status: "DRC",
      activity: "Pending Manifest Data Received",
      location: "RTO/CHD, BANGALORE, KARNATAKA",
      "sr-status": "NA",
      "sr-status-label": "NA",
    },
  ]);

  //get shipment track......................
  const getShimentTrack = async (token) => {
    const allData = { privateAxios, token, awb_code };
    try {
      const res = await adminGetShipmentTrack(allData);
      setTrackActivity(
        res.data.response.tracking_data.shipment_track_activities
      );
      setTrackData(res.data.response.tracking_data.shipment_track);
      setLoader(false);
      console.log("res", res);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  //generate invoice......................
  const downloadInvoice = async () => {
    const allData = { privateAxios, orderId, token };
    try {
      const res = await generateInvoice(allData);
      if (res.status == 200) {
        const pdfUrl = res.data.response.invoice_url;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "invoice.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast.error(`Error while downloading invoice`);
      console.log(error);
    }
  };

  //download label......................
  const downloadLabel = async () => {
    const allData = { privateAxios, shipment_id, token };
    try {
      const res = await generateLabelAPI(allData);
      if (res.status == 200) {
        const pdfUrl = res.data.response.label_url;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "label.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast.error(`Error while downloading label`);
      console.log(error);
    }
  };

  useEffect(() => {
    getShipRocketToken();
  }, []);

  return (
    <>
      {trackData &&
        trackData.map((item, index) => (
          <div key={index} className="flex justify-between">
            <div>
              <div className="">
                <span className="font-medium"> AwbId: </span>
                {item.awb_code}
              </div>
              <div className="">
                <span className="font-medium"> Courier: </span>
                {item.courier_name}
              </div>
              <div className="">
                <span className="font-medium"> Status: </span>
                {item.current_status}
              </div>
              <div className="">
                <span className="font-medium"> Origin:</span> {item.origin}
              </div>
              <div className="">
                <span className="font-medium"> Estimate Delivery Time:</span>{" "}
                {item.edd.split(" ")[0].split("-").reverse().join("-")}
              </div>
            </div>
            <div className="w-1/2 flex flex-col justify-start items-start">
              <h4>Generate Menifest First and then print it!</h4>
              <div className="space-y-2">
                <div className="space-x-2">
                  <button
                    disabled={generatedManifest}
                    onClick={() => generateMenifestFunc()}
                    className={`${
                      !generatedManifest ? "cta" : "bg-gray-600"
                    } px-4 py-2 rounded-full text-white`}
                  >
                    Generate Manifest
                  </button>
                  <button
                    onClick={() => printMenifestFunc()}
                    disabled={!generatedManifest}
                    className={`${
                      generatedManifest ? "cta" : "bg-gray-600"
                    } px-4 py-2 rounded-full text-white`}
                  >
                    Print Menifest
                  </button>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={downloadInvoice}
                    className="cta px-4 py-2 rounded-full text-white"
                  >
                    Download Invoice
                  </button>
                  <button
                    onClick={downloadLabel}
                    className="cta px-4 py-2 rounded-full text-white"
                  >
                    Download Label
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      <main className="relative min-h-screen flex flex-col justify-center  overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">
            <div className="w-full max-w-3xl mx-auto">
              <div className="-my-6">
                {/* Item #1 */}
                {loader ? (
                  <DataLoader />
                ) : (
                  trackActivity &&
                  trackActivity.map((val, index) => {
                    return (
                      <div
                        key={index}
                        className="relative pl-8 sm:pl-32 py-6 group "
                      >
                        <div className="bg-white p-4 rounded-lg">
                          <div className="font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0">
                            {val["sr-status-label"]}
                          </div>
                          <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">
                              {val.date}
                            </time>
                            <div className="text-xl font-bold text-slate-900">
                              {val.location}
                            </div>
                          </div>
                          <div className="text-slate-500">{val.activity}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminOrderCourierStatus;
