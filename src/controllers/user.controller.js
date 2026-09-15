const User = require("../models/user.model");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        message: "Please provide name or email to update"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (name) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          message: "Name must be at least 2 characters"
        });
      }

      user.name = name.trim();
    }

    if (email) {
      const newEmail = email.toLowerCase().trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(newEmail)) {
        return res.status(400).json({
          message: "Please enter a valid email"
        });
      }

      const existingUser = await User.findOne({
        email: newEmail,
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already registered"
        });
      }

      user.email = newEmail;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  getProfile,
  updateProfile
};