import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { ImSpinner8 } from "react-icons/im";
import styles from "../../styles/styles";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    if (!avatar) {
      toast.error("Please upload an avatar.");
      setIsLoading(false);
      return;
    }

    const newForm = new FormData();
    newForm.append("file", avatar);
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);
    newForm.append("phoneNumber", phoneNumber);
    newForm.append("address", address);
    newForm.append("zipCode", zipCode);

    try {
      const res = await axios.post(`${server}/shop/create-shop`, newForm, config);
      toast.success(res.data.message);
      
      // Redirect to login after successful registration
      navigate("/shop-login"); 

      // Reset form fields after successful submission
      setName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
      setZipCode("");
      setPassword("");
      setAvatar(null);
      setAvatarPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a seller
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {visible ? (
                  <AiOutlineEye className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(false)} />
                ) : (
                  <AiOutlineEyeInvisible className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(true)} />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <RxAvatar className="h-full w-full" />
                  )}
                </span>
                <label htmlFor="file-input" className="ml-5 flex items-center cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <span>Upload</span>
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full h-[40px] flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <ImSpinner8 className="animate-spin h-5 w-5 text-white" /> : "Submit"}
              </button>
            </div>
          </form>
          <div className={`${styles.noramlFlex} w-full mt-4`}>
            <h4>Already have an account?</h4>
            <Link to="/shop-login" className="text-blue-600 hover:text-blue-500 pl-2">
               Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
