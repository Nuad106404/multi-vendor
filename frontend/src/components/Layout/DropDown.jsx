import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const submitHandler = (category) => {
    navigate(`/products?categories=${encodeURIComponent(category.title)}`);
    setDropDown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setDropDown]);

  return (
    <div
      ref={dropdownRef}
      className="pb-4 w-full max-w-[270px] bg-white absolute z-30 rounded-b-lg shadow-lg border border-gray-200"
    >
      {categoriesData && categoriesData.map((category, index) => (
        <div
          key={index}
          className={`${styles.noramlFlex} flex items-center cursor-pointer py-2 px-4 hover:bg-[#f5f5f5] transition-colors duration-200`}
          onClick={() => submitHandler(category)}
        >
          <img
            src={category.image_Url}
            alt={category.title}
            className="w-6 h-6 mr-3 object-contain"
          />
          <h3 className="text-[#333] text-sm font-medium">{category.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default DropDown;
