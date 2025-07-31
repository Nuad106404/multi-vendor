import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { getAllProducts } from "../redux/actions/product";

const BestSellingPage = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, allProducts]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Sort products by `sold_out` in descending order
      const sortedData = [...allProducts].sort((a, b) => b.sold_out - a.sold_out);
      setSortedData(sortedData);
    }
  }, [allProducts]);

  return (
    <>
      <Header activeHeading={2} />

      {/** Hero Section */}
      <div className="relative w-full h-[300px] bg-gradient-to-r from-teal-500 to-green-400 flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          Best Selling Products
        </h1>
      </div>

      <div className={`${styles.section} py-10`}>
        {isLoading ? (
          <p className="text-center text-xl py-10">Loading best-selling products...</p>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
            {sortedData && sortedData.length > 0 ? (
              sortedData.map((product, index) => (
                <ProductCard data={product} key={index} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gradient-to-r from-blue-50 to-teal-50 text-teal-700 rounded-lg shadow-md">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-xl font-semibold mb-1">No Best Selling Products</p>
                <p className="text-sm text-gray-500">
                  Check back later for top-selling items!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default BestSellingPage;
