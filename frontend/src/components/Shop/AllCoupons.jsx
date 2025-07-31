import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, { withCredentials: true })
      .then((res) => {
        setIsLoading(false);
        setCoupons(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching coupons:", error);
      });
  }, [dispatch, seller._id]);

  const handleDelete = async (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then(() => {
        toast.success("Coupon code deleted successfully!");
        setCoupons(coupons.filter((coupon) => coupon._id !== id)); // Update local state to remove the deleted coupon
      })
      .catch((error) => {
        toast.error("Failed to delete coupon code!");
        console.error("Error deleting coupon:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProduct,
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setCoupons([...coupons, res.data.coupounCode]); // Update local state with new coupon
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error("Error creating coupon:", error);
      });
  };

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Coupon Code", minWidth: 180, flex: 1.4 },
    { field: "value", headerName: "Discount Value", minWidth: 100, flex: 0.6 },
    { field: "minAmount", headerName: "Min Amount", minWidth: 100, flex: 0.6 },
    { field: "maxAmount", headerName: "Max Amount", minWidth: 100, flex: 0.6 },
    { field: "selectedProduct", headerName: "Selected Product", minWidth: 180, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = coupons.map((item) => ({
    id: item._id,
    name: item.name,
    value: `${item.value} %`,
    minAmount: item.minAmount || "None",
    maxAmount: item.maxAmount || "None",
    selectedProduct: item.selectedProduct || "None",
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>
          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
                <div className="w-full flex justify-end">
                  <RxCross1 size={30} className="cursor-pointer" onClick={() => setOpen(false)} />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">Create Coupon Code</h5>
                <form onSubmit={handleSubmit} aria-required={true}>
                  <div>
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter coupon code name..."
                    />
                  </div>
                  <div>
                    <label className="pb-2">
                      Discount Percentage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      required
                      value={value}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter discount value..."
                    />
                  </div>
                  <div>
                    <label className="pb-2">Min Amount</label>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Enter minimum amount..."
                    />
                  </div>
                  <div>
                    <label className="pb-2">Max Amount</label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Enter maximum amount..."
                    />
                  </div>
                  <div>
                    <label className="pb-2">Selected Product</label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Choose a product</option>
                      {products &&
                        products.map((product) => (
                          <option value={product.name} key={product._id}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="submit"
                      value="Create"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px]"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;