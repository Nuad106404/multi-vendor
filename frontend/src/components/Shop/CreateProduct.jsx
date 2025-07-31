import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct, clearSuccess } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]); // for image preview only

  // Handle side effects for success and error
  useEffect(() => {
    if (error) toast.error(error);
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      dispatch(clearSuccess()); // Reset success state
    }
  }, [error, success, navigate, dispatch]);
  

  // Reset form data and image previews
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      tags: "",
      originalPrice: "",
      discountPrice: "",
      stock: "",
      images: []
    });
    setImagePreviews([]);
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image input change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    
    // Generate previews for selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, category, discountPrice, stock, images } = formData;

    // Validate required fields
    if (!name || !description || !category || !discountPrice || !stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Prepare form data for dispatch
    const newForm = new FormData();
    images.forEach((image) => newForm.append("images", image));
    newForm.append("name", formData.name);
    newForm.append("description", formData.description);
    newForm.append("category", formData.category);
    newForm.append("tags", formData.tags);
    newForm.append("originalPrice", formData.originalPrice);
    newForm.append("discountPrice", formData.discountPrice);
    newForm.append("stock", formData.stock);
    newForm.append("shopId", seller._id);

    dispatch(createProduct(newForm)); // Dispatch form data to create product
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Description <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="8"
            className="mt-2 block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400"
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">Category <span className="text-red-500">*</span></label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full mt-2 border h-[35px] rounded-[5px]"
          >
            <option value="">Choose a category</option>
            {categoriesData.map((category) => (
              <option key={category.title} value={category.title}>{category.title}</option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleInputChange}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Price (With Discount) <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleInputChange}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Product Stock <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className="mt-2 block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Upload Images <span className="text-red-500">*</span></label>
          <input
            type="file"
            id="upload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {imagePreviews.map((src, index) => (
              <img src={src} key={index} alt="Product" className="h-[120px] w-[120px] object-cover m-2" />
            ))}
          </div>
          <br />
          <input
            type="submit"
            value="Create"
            className="mt-2 cursor-pointer block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
