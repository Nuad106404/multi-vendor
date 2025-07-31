import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-[#1a1a1a] text-gray-300 font-light">
      {/** Header Section for Subscription */}
      <div className="flex flex-col items-center text-center lg:flex-row lg:justify-between sm:px-8 px-6 py-10 lg:py-12 bg-gradient-to-r from-[#2e2e2e] to-[#1a1a1a]">
        <h1 className="text-2xl lg:text-3xl font-semibold text-white mb-6 lg:mb-0 lg:w-1/2 leading-snug">
          <span className="text-[#56d879]">Subscribe</span> to get updates on news, events, and offers!
        </h1>
        <div className="flex w-full lg:w-auto">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="text-gray-800 px-4 py-2 rounded-l-lg outline-none flex-grow lg:flex-grow-0 sm:w-72 focus:ring-2 focus:ring-teal-500"
          />
          <button className="bg-[#56d879] hover:bg-teal-500 text-white py-2 px-4 rounded-r-lg font-medium transition duration-300">
            Submit
          </button>
        </div>
      </div>

      {/** Links Section */}
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-4 gap-8 px-6 py-12 lg:px-12">
        {/** Company Info and Social Links */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Logo"
            className="w-28 mb-4 filter invert"
          />
          <p className="text-gray-400 mb-4">Your one-stop shop for quality products and services.</p>
          <div className="flex space-x-4">
            <AiFillFacebook size={20} className="cursor-pointer hover:text-[#56d879]" />
            <AiOutlineTwitter size={20} className="cursor-pointer hover:text-[#56d879]" />
            <AiFillInstagram size={20} className="cursor-pointer hover:text-[#56d879]" />
            <AiFillYoutube size={20} className="cursor-pointer hover:text-[#56d879]" />
          </div>
        </div>

        {/** Company Links */}
        <div className="text-center lg:text-left">
          <h2 className="text-lg font-semibold text-white mb-4">Company</h2>
          {footerProductLinks.map((link, index) => (
            <Link
              key={index}
              to={link.link}
              className="block text-gray-400 hover:text-teal-400 text-sm mb-2 transition duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/** Shop Links */}
        <div className="text-center lg:text-left">
          <h2 className="text-lg font-semibold text-white mb-4">Shop</h2>
          {footercompanyLinks.map((link, index) => (
            <Link
              key={index}
              to={link.link}
              className="block text-gray-400 hover:text-teal-400 text-sm mb-2 transition duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/** Support Links */}
        <div className="text-center lg:text-left">
          <h2 className="text-lg font-semibold text-white mb-4">Support</h2>
          {footerSupportLinks.map((link, index) => (
            <Link
              key={index}
              to={link.link}
              className="block text-gray-400 hover:text-teal-400 text-sm mb-2 transition duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/** Bottom Section for Payment Options and Legal Info */}
      <div className="border-t border-gray-700 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 text-gray-400 text-sm">
          <span className="mb-2 lg:mb-0">© 2024 NUAD. All rights reserved.</span>
          <span className="mb-2 lg:mb-0">Terms · Privacy Policy</span>
          <img
            src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
            alt="Payment Methods"
            className="w-28 mt-4 lg:mt-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
