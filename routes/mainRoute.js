const express = require("express");

// import of other routes
const pharmacyRoute = require("./pharmacyRoute.js");
const billRoute = require("./billRoute.js");

const router = express.Router();

router.use("/pharmacy", pharmacyRoute);
router.use("/bill", billRoute);

module.exports = router;
