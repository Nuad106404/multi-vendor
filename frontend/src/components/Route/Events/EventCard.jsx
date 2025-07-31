import React from "react";
import styles from "../../../styles/styles";
import CountDown from "./CountDown";
import { backend_url } from "../../../server";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ event, active }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (event) => {
    const isItemExists = cart && cart.find((i) => i._id === event._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (event.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...event, qty: 1 }; // Use `event` directly
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  }

  return (
    <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
      <div className="w-full lg:w-[50%] m-auto">
        <img
          src={`${backend_url}${event.images && event.images[0]}`}
          alt={event.name || "Event Image"}
          className="w-full object-cover rounded-lg"
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center p-4">
        <h2 className={`${styles.productTitle}`}>{event.name || "Event Title"}</h2>
        <p className="text-gray-700">
          {event.description || "Event description goes here. Please provide a description."}
        </p>
        <div className="flex py-2 justify-between">
          <div className="flex items-center">
            <h5 className="font-semibold text-[18px] text-[#d55b45] pr-3 line-through">
              {event.originalPrice ? `${event.originalPrice}$` : ""}
            </h5>
            <h5 className="font-bold text-[20px] text-[#333]">
              {event.discountPrice ? `${event.discountPrice}$` : ""}
            </h5>
          </div>
          <span className="font-medium text-[17px] text-[#44a55e]">
            {event.sold_out || 0} sold
          </span>
        </div>
        <CountDown startDate={event.start_Date} endDate={event.Finish_Date} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${event._id}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div className={`${styles.button} text-[#fff] ml-5`} onClick={() => addToCartHandler(event)}>Add to cart</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
