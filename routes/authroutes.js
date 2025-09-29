const express = require("express");
const router = express.Router();

const { getAllUsers, loginUser, createUser, updateUser, deleteUser } = require("../controllers/authcontroller");
const { authMiddleware } = require("../middleware/authMiddleware");


router.post("/login", loginUser);
router.get("/getuserlist",authMiddleware,getAllUsers)
router.post("/createUser",authMiddleware, createUser)

router.put("/updateuser/:id",authMiddleware, updateUser);
router.delete("/deleteuser/:id",authMiddleware, deleteUser);
module.exports = router;
