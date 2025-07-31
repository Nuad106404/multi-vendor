import axios from "axios";
import { server } from "../../server";

// create product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(`${server}/product/create-product`, productData, config);

    dispatch({ type: "productCreateSuccess", payload: data.product });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// Define the clearSuccess action
export const clearSuccess = () => ({
  type: "clearSuccess"
});


// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
};

// deleteProduct action
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });

    const { data } = await axios.delete(`${server}/product/delete-shop-product/${id}`, {
      withCredentials: true,
    });

    dispatch({ type: "deleteProductSuccess", payload: data.message });
    console.log("Product deleted:", data.message); // Confirm delete response
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response?.data?.message || "Delete failed",
    });
    console.error("Error deleting product:", error.message);
  }
};

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    console.log("Fetched Products:", data.products); // Log the response data
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};


