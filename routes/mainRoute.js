const express = require("express");

// import of other routes
const pharmacyRoute = require("./pharmacyRoute.js");
const billRoute = require("./billRoute.js");
const studnetRoute = require("./studentRoute.js");
const feedbackRoute = require("./feedbackRoute.js");

const router = express.Router();

router.use("/pharmacy", pharmacyRoute);
router.use("/bill", billRoute);
router.use("/student", studnetRoute);
router.use("/feedback", feedbackRoute);

module.exports = router;
