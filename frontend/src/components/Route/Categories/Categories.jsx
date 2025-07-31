import React from "react";
import styles from "../../../styles/styles";
import { brandingData, categoriesData } from "../../../static/data";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  return (
    <>
      {/** Branding Section */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 grid grid-cols-2 md:grid-cols-4 gap-6 p-6 shadow-lg bg-gradient-to-br from-white to-gray-100 rounded-xl">
          {brandingData &&
            brandingData.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-white rounded-lg hover:bg-[#f9f9f9] transition duration-300 transform hover:scale-105 shadow-md"
              >
                <div className="text-[#10a37f] text-xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/** Categories Section */}
      <div className={`${styles.section} bg-white rounded-xl mb-12 p-6`} id="categories">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categoriesData &&
            categoriesData.map((category) => {
              const handleSubmit = () => {
                navigate(`/products?categories=${encodeURIComponent(category.title)}`);
              };
              return (
                <div
                  key={category.id}
                  className="relative flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition transform hover:scale-105 hover:bg-gradient-to-r from-[#f0f7ff] to-white"
                  onClick={handleSubmit}
                >
                  <div className="w-[80px] h-[80px] mb-4 overflow-hidden rounded-full shadow-inner">
                    <img
                      src={category.image_Url}
                      alt={category.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <h5 className="text-lg font-semibold text-gray-700 mb-1">{category.title}</h5>
                  <p className="text-sm text-gray-500">Shop Now</p>
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-lg" />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
