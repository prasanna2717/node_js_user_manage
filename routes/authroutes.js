const express = require("express");
const router = express.Router();

const {getAllUsers,loginUser,createUser,updateUser, deleteUser} =require("../controllers/authcontroller")
// Register new user (optional for testing)

// Login
router.post("/login", loginUser);
router.get("/getuserlist",getAllUsers)
router.post("/createUser",createUser)
router.post("/updateuser/:id",updateUser)

router.put("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);
module.exports = router;
