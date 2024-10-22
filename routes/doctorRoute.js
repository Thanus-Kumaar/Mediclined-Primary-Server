const express = require("express");
const doctorController = require("../controllers/doctorController.js");

const router = express.Router();

router
  .route("/:email")
  .get(doctorController.getDoctorDetails)
  .delete(doctorController.deleteDoctor);

router.post("/", doctorController.addDoctor);
router.put("/", doctorController.editDoctor);
router.get("/doctors", doctorController.getAllDoctors);

module.exports = router;
