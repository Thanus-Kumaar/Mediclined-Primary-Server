const express = require("express");
const doctorController = require("../controllers/doctorController.js");

const { authorizeRole } = require("../middlewares/webTokenValidator.js");

const router = express.Router();

router
  .route("/:email")
  .get(authorizeRole(["D"]), doctorController.getDoctorDetails)
  .delete(authorizeRole(["A"]), doctorController.deleteDoctor);

router.post("/", authorizeRole(["A"]), doctorController.addDoctor);
router.put("/", authorizeRole(["A", "D"]), doctorController.editDoctor);
router.get("/doctors", authorizeRole(["A"]), doctorController.getAllDoctors);

module.exports = router;
