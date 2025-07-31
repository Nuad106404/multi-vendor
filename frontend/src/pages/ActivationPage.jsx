import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(null);
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const activateAccount = async () => {
      if (activation_token) {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(res.data.message);
          setIsActivated(true);  // Set activation success state
        } catch (error) {
          console.log(error.response?.data?.message || "An error occurred");
          setError(error.response?.data?.message || "Token expired!");
        } finally {
          setIsLoading(false);
        }
      }
    };

    activateAccount();
  }, [activation_token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
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
        ) : (
          <div className="text-green-500">
            <AiOutlineCheckCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Account Activated</h2>
            <p className="mt-2 text-gray-600">
              Your account has been successfully activated!
            </p>
            <button
              onClick={() => window.location.replace("/login")}
              className="mt-6 bg-[#10a37f] text-white px-6 py-2 rounded-full hover:bg-[#0c7855] transition duration-300 ease-in-out"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;
