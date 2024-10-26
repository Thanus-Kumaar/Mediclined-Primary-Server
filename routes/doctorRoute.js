const express = require("express");
const doctorController = require("../controllers/doctorController.js");

const { authorizeRole } = require("../middlewares/webTokenValidator.js");

const router = express.Router();

router.get("/doctors", authorizeRole(["A"]), doctorController.getAllDoctors);

router
  .route("/:email")
  .get(authorizeRole(["D"]), doctorController.getDoctorDetails)
  .delete(authorizeRole(["A"]), doctorController.deleteDoctor);

router.post("/", authorizeRole(["A"]), doctorController.addDoctor);
router.put("/", authorizeRole(["A", "D"]), doctorController.editDoctor);

module.exports = router;
