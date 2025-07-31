import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader"; // Import Loader for loading state

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller && seller._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleDelete = async (id) => {
    console.log("Deleting product ID:", id); // Confirm ID is correct
    await dispatch(deleteProduct(id));
    dispatch(getAllProductsShop(seller._id)); // Refresh the product list after deletion
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold Out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.row.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Action",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = products
    ? products.map((item) => ({
        id: item._id,
        name: item.name,
        price: `US$ ${item.discountPrice}`,
        Stock: item.stock,
        sold: item.sold_out ?? 0,
      }))
    : [];

  return (
    <>
      {isLoading ? (
        <Loader /> // Show Loader component while loading
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;
