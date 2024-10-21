const express = require("express");
const feedbackController = require("../controllers/feedbackController.js");

const router = express.Router();

router.get("/getFeedback", feedbackController.getFeedback);
router.post("/sendFeedback", feedbackController.sendFeedback);

module.exports = router;
