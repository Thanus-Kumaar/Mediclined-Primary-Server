const express = require("express");
const feedbackController = require("../controllers/feedbackController.js");

const { authorizeRole } = require("../middlewares/webTokenValidator.js");

const router = express.Router();

router.get("/:clinicID",authorizeRole(["C"]), feedbackController.getFeedback);
router.post("/",authorizeRole(["S"]), feedbackController.sendFeedback);

module.exports = router;
