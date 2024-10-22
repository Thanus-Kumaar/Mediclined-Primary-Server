const express = require("express");
const feedbackController = require("../controllers/feedbackController.js");

const router = express.Router();

router.get("/:clinicID", feedbackController.getFeedback);
router.post("/", feedbackController.sendFeedback);

module.exports = router;
