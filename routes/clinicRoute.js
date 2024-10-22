const express = require("express");
const clinicController = require("../controllers/feedbackController.js");

const router = express.Router();

// Route to create a clinic
router.post("/createClinic", clinicController.createClinic);

// Route to get all clinics
router.get("/getClinics", clinicController.getClinics);

// Route to get a specific clinic by ID
router.get("/getClinic/:clinicID", clinicController.getClinicById);

// Route to update a clinic
router.put("/updateClinic/:clinicID", clinicController.updateClinic);

// Route to delete a clinic
router.delete("/deleteClinic/:clinicID", clinicController.deleteClinic);

// Route to check doctor availability
router.get(
  "/getClinic/:clinicID/availability",
  clinicController.checkDoctorAvailability
);

// Route to update doctor availability
router.put(
  "/clinic/updateAvailability",
  clinicController.updateDoctorAvailability
);

module.exports = router;
