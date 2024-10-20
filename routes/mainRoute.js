const express = require("express");

// import of other routes
const pharmacyRoute = require("./pharmacyRoute.js");

const router = express.Router();

router.use("/pharmacy", pharmacyRoute);

module.exports = router;
