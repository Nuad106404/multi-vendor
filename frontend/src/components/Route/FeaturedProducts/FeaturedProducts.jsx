import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { getAllProducts } from "../../../redux/actions/product";

const FeaturedProduct = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading } = useSelector((state) => state.products);

  // Fetch products on component mount if not already fetched
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Featured Products</h1>
          <p className="text-gray-500">Top picks of the week</p>
        </div>

        {isLoading ? (
          <p className="text-center py-10">Loading featured products...</p>
        ) : (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
            {allProducts && allProducts.length > 0 ? (
              allProducts.map((product, index) => (
                <ProductCard key={index} data={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No featured products available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProduct;
