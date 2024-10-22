const express = require("express");
const feedbackController = require("../controllers/feedbackController.js");

const router = express.Router();

router.get("/feedback/:clinicID", feedbackController.getFeedback);
router.post("/feedback", feedbackController.sendFeedback);

module.exports = router;
