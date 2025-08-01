import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import EventCard from "../Route/Events/EventCard";
import Ratings from "../Products/Ratings.jsx";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event"; // Import shop-specific event action
import { backend_url } from "../../server.js";
import { formatDistanceToNow } from "date-fns"; // Import relative time formatting

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events, isLoading } = useSelector((state) => state.events); // Get shop-specific events
  const [active, setActive] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id)); // Fetch shop-specific events
  }, [dispatch, id]);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 2 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Running Events
            </h5>
          </div>

          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <Link to="/dashboard">
              <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                <span className="text-[#fff]">Go Dashboard</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full flex justify-center">
          {isLoading ? (
            <p className="text-center text-xl py-10">Loading events...</p>
          ) : events && events.length > 0 ? ( // Use events specific to the shop
            events.map((event) => (
              <EventCard key={event._id} event={event} active={true} />
            ))
          ) : (
            <p className="text-center text-xl py-10">No events available.</p>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((item, index) => (
              <div className="w-full flex my-4" key={index}>
                <img
                  src={`${backend_url}${item.user.avatar}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-2">
                  <div className="flex w-full items-center">
                    <h1 className="font-[600] pr-2">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">
                    {item?.createdAt
                      ? `${formatDistanceToNow(new Date(item.createdAt))} ago`
                      : "No date provided"}
                  </p>
                </div>
              </div>
            ))}
          {allReviews && allReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews have for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;