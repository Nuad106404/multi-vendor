import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/actions/product";
import Loader from "../components/Layout/Loader";

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("categories"); // Retrieve 'categories' parameter from URL
  const { allProducts: products = [], isLoading } = useSelector((state) => state.products); // Default products to an empty array
  const { id } = useParams();
  const dispatch = useDispatch();

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(getAllProducts(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Ensure products is defined (default to empty array if undefined)
    const filteredData = category
      ? products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase() === category.toLowerCase()
        )
      : products;

    setFilteredProducts(filteredData);
  }, [category, products]);

  return (
    <div>
      <Header activeHeading={3} />
      <div className={`${styles.section} py-8`}>
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-4 xl:grid-cols-5 mb-12">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center">
              <Loader />
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((i, index) => (
              <ProductCard data={i} key={index} />
            ))
          ) : (
            <h1 className="col-span-full flex flex-col items-center justify-center py-12 bg-gradient-to-r from-blue-50 to-teal-50 text-teal-700 rounded-lg shadow-md">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-xl font-semibold mb-1">Oops! No Products Found</p>
              <p className="text-sm text-gray-500">
                What are you looking for? Try searching for another product.
              </p>
            </h1>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;