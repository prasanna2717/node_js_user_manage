const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../security");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Only admin account allowed or user not found.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profile: user.profile,
      },
      message: 'Login successful.',
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error. Please try again later.' });
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
     const isExist = await User.findOne({ email,_id:{
      $ne:id
     } })
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email === 'eve.holt@reqres.in') {
      return res.status(403).json({ message: "Admin account cannot be deleted." });
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User data deleted." });

  } catch (err) {
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};