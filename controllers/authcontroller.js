const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../security");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // First-time login: create user with plain password
      user = new User({
        email,
        password, // stored as plain text
        firstname: "New",
        lastname: "User",
        profile: "https://example.com/default-profile.png"
      });

      await user.save();
    } else {
      // Existing user: compare plain password
      if (user.password !== password) {
        return res.status(400).json({ message: "Invalid credentialdcsdsds" });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profile: user.profile,
      },
      message:'Login Successfully.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query; 

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    };

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      firstname,
      lastname,
      email,
      profile,
      password: "default123" // optional default if needed
    });

    await newUser.save();
    res.status(201).json({message:'User created successfully.',newUser});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, profile } = req.body;
    const isExist = await User.findOne({ email })
    if (isExist) {
      return res.status(400).json({ message: 'Email already exist' })
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstname, lastname, email, profile },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({message:'User data updated.',updatedUser});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "userId")
    const deleteUser = await User.findByIdAndDelete(id);
    console.log(deleteUser, "deleteUser")
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: 'User data deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};