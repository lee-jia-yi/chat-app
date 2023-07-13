const {
    login,
    register,
    setAvatar,
    getAllUsers,
    logout
} = require("../controllers/userController");

const express = require("express");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/setAvatar/:id", setAvatar);
router.post("/logout/:id", logout);
router.get("/allusers/:id", getAllUsers);

module.exports = router;