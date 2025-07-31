const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

// Create coupon code
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Attempting to create coupon code with data:", req.body);

      // Check if coupon code already exists
      const isCoupounCodeExists = await CoupounCode.find({
        name: req.body.name,
      });
      console.log("Coupon code existence check result:", isCoupounCodeExists);

      if (isCoupounCodeExists.length !== 0) {
        console.log("Coupon code already exists, aborting creation.");
        return next(new ErrorHandler("Coupon code already exists!", 400));
      }

      // Create new coupon code
      const coupounCode = await CoupounCode.create(req.body);
      console.log("Coupon code created successfully:", coupounCode);

      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      console.error("Error while creating coupon code:", error);
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Get all coupons of a shop
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Fetching coupons for shop ID:", req.seller.id);

      const couponCodes = await CoupounCode.find({ shopId: req.seller.id });
      console.log("Coupons found:", couponCodes);

      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      console.error("Error while fetching coupons:", error);
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Delete coupon code of a shop
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Attempting to delete coupon code with ID:", req.params.id);

      const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);
      console.log("Coupon deletion result:", couponCode);

      if (!couponCode) {
        console.log("Coupon code does not exist, cannot delete.");
        return next(new ErrorHandler("Coupon code doesn't exist!", 400));
      }

      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      console.error("Error while deleting coupon code:", error);
      return next(new ErrorHandler(error, 400));
    }
  })
);

// Get coupon code value by its name
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Fetching coupon code value for name:", req.params.name);

      const couponCode = await CoupounCode.findOne({ name: req.params.name });
      console.log("Coupon code found:", couponCode);

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      console.error("Error while fetching coupon code value:", error);
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;