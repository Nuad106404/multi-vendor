import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);

      if (isItemExist) {
        // Update item if it exists in the cart
        state.cart = state.cart.map((i) => (i._id === isItemExist._id ? item : i));
      } else {
        // Add new item to the cart
        state.cart.push(item);
      }
    })
    .addCase("removeFromCart", (state, action) => {
      // Remove item from the cart by filtering out the matching item
      state.cart = state.cart.filter((i) => i._id !== action.payload);
    });
});