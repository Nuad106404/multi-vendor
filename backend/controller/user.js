const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Route to create a new user
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      if (req.file) {
        const filename = req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // If the file upload is successful, retrieve its filename
    const filename = req.file?.filename;
    const fileUrl = filename ? path.join(filename) : null;

    // Prepare user data for activation token
    const user = {
      name,
      email,
      password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Activation email sent to: ${user.email}. Please check your email to activate your account.`,
      });
    } catch (error) {
      return next(new ErrorHandler("Error sending activation email", 500));
    }
  } catch (error) {
    return next(new ErrorHandler("Error creating user", 400));
  }
});

// Function to create an activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Route to activate a user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      // Verify the token
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      if (!newUser) {
        return next(
          new ErrorHandler("Invalid or expired activation token", 400)
        );
      }

      const { name, email, password, avatar } = newUser;

      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists. Please log in.",
        });
      }

      // Create the new user
      user = await User.create({
        name,
        email,
        password,
        avatar,
      });

      // Send token on successful activation
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler("Error activating user", 500));
    }
  })
);

// loginUser
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email", 400));
      }

      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password", 400));
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// loadUser
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// logoutUser
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.clearCookie("token");

      res.status(201).json({
        success: true,
        message: "Logged out successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;

      fs.unlinkSync(existAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      console.log(addressId);

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }
      
      // Handle avatar deletion properly
      if (user.avatar) {
        try {
          // Check if avatar is stored as a Cloudinary URL with public_id
          if (typeof user.avatar === 'object' && user.avatar.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
          } 
          // If avatar is a local file path, delete from filesystem
          else if (typeof user.avatar === 'string' && user.avatar.includes('/')) {
            const avatarPath = `uploads/${user.avatar}`;
            if (fs.existsSync(avatarPath)) {
              fs.unlinkSync(avatarPath);
            }
          }
        } catch (error) {
          console.error("Error deleting avatar:", error);
          // Continue with user deletion even if avatar deletion fails
        }
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
