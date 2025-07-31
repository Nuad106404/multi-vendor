import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [payPalClientId, setPayPalClientId] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Load order data from local storage
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);

    // Fetch PayPal client ID dynamically
    const fetchPayPalClientId = async () => {
      try {
        const { data } = await axios.get(`${server}/payment/paypal-client-id`);
        setPayPalClientId(data.clientId);
        console.log("PayPal Client ID:", data.clientId); // Log the PayPal Client ID
      } catch (error) {
        toast.error("Failed to load PayPal client ID");
      }
    };

    fetchPayPalClientId();
    
  }, []);
  
  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  // PayPal order creation
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Order Payment",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => orderID);
  };

  // PayPal onApprove handler
  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      if (payer) paypalPaymentHandler(payer);
    });
  };

  // PayPal payment handler
  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    try {
      await axios.post(`${server}/order/create-order`, order, config);
      handleSuccess();
    } catch (error) {
      toast.error("Failed to complete PayPal payment");
    }
  };

  // Stripe payment handler
  const paymentHandler = async (e) => {
    e.preventDefault();

    const paymentData = { amount: Math.round(orderData?.totalPrice * 100) };
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    try {
      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;
      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          type: "Credit Card",
        };
        await axios.post(`${server}/order/create-order`, order, config);
        handleSuccess();
      }
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  // Cash on delivery handler
  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    order.paymentInfo = { type: "Cash On Delivery" };

    try {
      await axios.post(`${server}/order/create-order`, order, config);
      handleSuccess();
    } catch (error) {
      toast.error("Failed to complete cash on delivery");
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    navigate("/order/success");
    toast.success("Order successful!");
    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("latestOrder", JSON.stringify([]));
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
            payPalClientId={payPalClientId}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
  payPalClientId,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      {/* Payment Method Selection */}
      <div>
        {/* Credit/Debit Card */}
        <PaymentMethodOption
          title="Pay with Debit/Credit Card"
          selected={select === 1}
          onSelect={() => setSelect(1)}
        />
        {select === 1 && (
          <form className="w-full" onSubmit={paymentHandler}>
            {/* Card Elements */}
            <CardElements user={user} />
            <input
              type="submit"
              value="Pay"
              className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
            />
          </form>
        )}

        {/* PayPal */}
        <PaymentMethodOption
          title="Pay with PayPal"
          selected={select === 2}
          onSelect={() => setSelect(2)}
        />
        {select === 2 && (
          <PayPalPayment
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            payPalClientId={payPalClientId}
          />
        )}

        {/* Cash on Delivery */}
        <PaymentMethodOption
          title="Cash on Delivery"
          selected={select === 3}
          onSelect={() => setSelect(3)}
        />
        {select === 3 && (
          <form className="w-full" onSubmit={cashOnDeliveryHandler}>
            <input
              type="submit"
              value="Confirm"
              className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
            />
          </form>
        )}
      </div>
    </div>
  );
};

const PaymentMethodOption = ({ title, selected, onSelect }) => (
  <div className="flex w-full pb-5 border-b mb-2">
    <div
      className={`w-[25px] h-[25px] rounded-full bg-transparent border-[3px] ${
        selected ? "border-[#f63b60]" : "border-[#1d1a1ab4]"
      } relative flex items-center justify-center`}
      onClick={onSelect}
    >
      {selected && (
        <div className="w-[13px] h-[13px] bg-[#f63b60] rounded-full" />
      )}
    </div>
    <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">{title}</h4>
  </div>
);

const CardElements = ({ user }) => (
  <div>
    <div className="w-full flex pb-3">
      <div className="w-[50%]">
        <label className="block pb-2">Name on Card</label>
        <input
          required
          placeholder={user && user.name}
          className={`${styles.input} !w-[95%] text-[#444]`}
        />
      </div>
      <div className="w-[50%]">
        <label className="block pb-2">Expiry Date</label>
        <CardExpiryElement
          className={`${styles.input}`}
          options={{
            style: {
              base: { fontSize: "19px", color: "#444" },
              empty: { color: "#3a120a" },
            },
          }}
        />
      </div>
    </div>
    <div className="w-full flex pb-3">
      <div className="w-[50%]">
        <label className="block pb-2">Card Number</label>
        <CardNumberElement
          className={`${styles.input} !w-[95%]`}
          options={{
            style: {
              base: { fontSize: "19px", color: "#444" },
              empty: { color: "#3a120a" },
            },
          }}
        />
      </div>
      <div className="w-[50%]">
        <label className="block pb-2">CVV</label>
        <CardCvcElement
          className={`${styles.input}`}
          options={{
            style: {
              base: { fontSize: "19px", color: "#444" },
              empty: { color: "#3a120a" },
            },
          }}
        />
      </div>
    </div>
  </div>
);

const PayPalPayment = ({ open, setOpen, onApprove, createOrder, payPalClientId }) => (
  <>
    <div
      className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
      onClick={() => setOpen(true)}
    >
      Pay Now
    </div>
    {open && (
      <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
        <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
          <div className="w-full flex justify-end p-3">
            <RxCross1
              size={30}
              className="cursor-pointer absolute top-3 right-3"
              onClick={() => setOpen(false)}
            />
          </div>
          <PayPalScriptProvider options={{ "client-id": payPalClientId }}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              onApprove={onApprove}
              createOrder={createOrder}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    )}
  </>
);

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);

  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${orderData?.subTotalPrice}</h5>
      </div>
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping}</h5>
      </div>
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountPrice ? "$" + orderData.discountPrice : "-"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        ${orderData?.totalPrice}
      </h5>
    </div>
  );
};

export default Payment;