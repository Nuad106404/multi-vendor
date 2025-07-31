const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Product = require("../model/product");
const Shop = require("../model/shop");
const Order = require("../model/order"); // Import the Order model
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const path = require("path");

// Create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productID = req.params.id;
      const product = await Product.findById(productID);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // Delete images from the filesystem
      product.images.forEach((imageName) => {
        const imagePath = path.resolve(__dirname, "../../uploads", imageName);

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", imagePath, err);
          }
        });
      });

      // Delete the product from the database
      await Product.findByIdAndDelete(productID);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      console.log("Received review data:", { user, rating, comment, productId, orderId }); // Log received data

      // Validate product ID
      if (!productId) {
        console.error("Product ID is missing in the request");
        return next(new ErrorHandler("Product ID is required", 400));
      }

      // Find the product
      const product = await Product.findById(productId);
      if (!product) {
        console.error("Product not found for ID:", productId);
        return next(new ErrorHandler("Product not found", 404));
      }

      console.log("Product found:", product.name);

      // Prepare the review object
      const review = {
        user,
        rating,
        comment,
        productId,
        orderId,
      };

      // Check if the product is already reviewed by the user
      const isReviewed = product.reviews.find(
        (rev) => rev.user._id.toString() === user._id.toString()
      );

      if (isReviewed) {
        console.log("User has already reviewed this product. Updating review.");
        product.reviews.forEach((rev) => {
          if (rev.user._id.toString() === user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
          }
        });
      } else {
        console.log("Adding a new review for the product.");
        product.reviews.push(review);
      }

      // Update average rating
      const totalRatings = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
      product.ratings = totalRatings / product.reviews.length;

      console.log("Updated average rating:", product.ratings);

      // Save the product
      await product.save({ validateBeforeSave: false });
      console.log("Product reviews updated successfully.");

      // Mark the product as reviewed in the order
      const orderUpdate = await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      if (!orderUpdate) {
        console.error("Failed to update the order for ID:", orderId);
      } else {
        console.log("Order updated successfully for ID:", orderId);
      }

      res.status(200).json({
        success: true,
        message: "Review added successfully",
      });
    } catch (error) {
      console.error("Error in /create-new-review endpoint:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;