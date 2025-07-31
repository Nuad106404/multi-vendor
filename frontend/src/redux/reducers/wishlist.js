import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishlist.find((i) => i._id === item._id);

      if (isItemExist) {
        // Update item if it exists in the wishlist
        state.wishlist = state.wishlist.map((i) => 
          i._id === isItemExist._id ? item : i
        );
      } else {
        // Add new item to the wishlist
        state.wishlist.push(item);
      }
    })
    .addCase("removeFromWishlist", (state, action) => {
      // Remove item from the wishlist by filtering out the matching item
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
    });
});