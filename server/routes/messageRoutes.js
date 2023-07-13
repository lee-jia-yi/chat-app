const {
    addMessage,
    getMessages,
} = require("../controllers/messageController");

const express = require("express");
const router = express.Router();

router.post("/addMessage/", addMessage);
router.post("/getMessages/", getMessages);

module.exports = router;