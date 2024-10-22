const express = require("express");
const clinicController = require("../controllers/clinicController.js");

const router = express.Router();

// Route to create a clinic
router.post("/", clinicController.createClinic);

// Route to get all clinics
router.get("/clinics", clinicController.getClinics);

// Route to get, update, or delete a clinic by ID
router
  .route("/:clinicID")
  .get(clinicController.getClinicById)       // Get a specific clinic by ID
  .put(clinicController.updateClinic)        // Update a clinic by ID
  .delete(clinicController.deleteClinic);    // Delete a clinic by ID

// Route to check and update doctor availability for a specific clinic
router
  .route("/:clinicID/availability")
  .get(clinicController.checkDoctorAvailability)   // Check doctor availability
  .put(clinicController.updateDoctorAvailability); // Update doctor availability


module.exports = router;
