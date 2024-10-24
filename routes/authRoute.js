const express = require("express");
const authController = require("../controllers/authController.js");
const router = express.Router();

router.post("/login", authController.login);
router.post("/clinicLogin", authController.clinicLogin);

module.exports = router;
