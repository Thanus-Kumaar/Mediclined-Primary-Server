const express = require("express");

// import of other routes
const pharmacyRoute = require("./pharmacyRoute.js");
const billRoute = require("./billRoute.js");
const studentRoute = require("./studentRoute.js");
const feedbackRoute = require("./feedbackRoute.js");
const clinicRoute = require("./clinicRoute.js");
const doctorRoute = require("./doctorRoute.js");
const authRoute = require("./authRoute.js");

const router = express.Router();

router.use("/pharmacy", pharmacyRoute);
router.use("/bill", billRoute);
router.use("/student", studentRoute);
router.use("/feedback", feedbackRoute);
router.use("/clinic", clinicRoute);
router.use("/doctor", doctorRoute);
router.use("/", authRoute);

module.exports = router;
