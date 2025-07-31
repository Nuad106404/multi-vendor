const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Event = require("../model/event"); // Assuming you have Event model
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const path = require("path");

// Create event with image upload
router.post(
  "/create-event",
  upload.array("images"), // Use multer to handle image uploads
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      // Check if files are provided
      const files = req.files;
      if (!files || files.length === 0) {
        return next(new ErrorHandler("No images provided", 400));
      }

      // Collect file names of uploaded images
      const imageUrls = files.map((file) => file.filename);

      const eventData = req.body;
      eventData.images = imageUrls;
      eventData.shop = shop;

      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all events
router.get(
  "/get-all-events",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find();
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all events of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const eventID = req.params.id;
      const event = await Event.findById(eventID);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      // Delete each image associated with the event
      event.images.forEach((imageName) => {
        const imagePath = path.resolve(__dirname, "../../uploads", imageName);
        console.log("Attempting to delete image at:", imagePath);

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Failed to delete image:", imagePath, err);
          } else {
            console.log("Deleted image:", imagePath);
          }
        });
      });

      // Delete the event record from the database
      await Event.findByIdAndDelete(eventID);

      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all events for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;