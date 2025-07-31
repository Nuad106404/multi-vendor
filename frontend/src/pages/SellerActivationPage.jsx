import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "../server";
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isActivated, setIsActivated] = useState(
    JSON.parse(localStorage.getItem("isActivated")) || false
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      if (isActivated) return; // Don't run if already activated
      setIsLoading(true);
      try {
        const res = await axios.post(`${server}/shop/activation_shop`, {
          activation_token,
        });
   
        if (res.data.success) {
          setIsActivated(true);
          localStorage.setItem("isActivated", JSON.stringify(true));
        } else {
          setError(res.data.message);
        }
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
        setError(error.response?.data?.message || "Token expired!");
      } finally {
        setIsLoading(false);
      }
    };
   
    if (activation_token && !isActivated) activateAccount();
  }, [activation_token, isActivated]);

  useEffect(() => {
    if (isActivated) {
      const redirectTimeout = setTimeout(() => {
        localStorage.removeItem("isActivated"); // Clear activation status
        navigate("/shop-login");
      }, 3000);
  
      return () => clearTimeout(redirectTimeout);
    }
  }, [isActivated, navigate]);
  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
        {error ? (
          <div className="text-red-500">
            <AiOutlineExclamationCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Activation Failed</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => window.location.replace("/resend-activation")}
              className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition duration-300 ease-in-out"
            >
              Resend Activation
            </button>
          </div>
        ) : isActivated ? (
          <div className="text-green-500">
            <AiOutlineCheckCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Account Activated</h2>
            <p className="mt-2 text-gray-600">
              Your account has been successfully activated! Redirecting to login...
            </p>
          </div>
        ) : (
          <p>{isLoading ? "Activating your account..." : "Activation in progress"}</p>
        )}
      </div>
    </div>
  );
};

export default SellerActivationPage;
