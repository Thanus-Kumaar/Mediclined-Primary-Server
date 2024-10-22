const express = require("express");
const studentController = require("../controllers/studentController.js");

const router = express.Router();

// only for admins
router
  .route("/students")
  .get(studentController.getAllStudents)
  .post(studentController.addStudents)
  .delete(studentController.deleteStudents);

router.put("/student/password", studentController.updateStudentPassword);
router.put("/student/resetPassword", studentController.resetStudentPassword); // Admin can reset a student's password and send via email.

// for students dashboard
router.get("/student", studentController.studentDetails);
router.put("/student", studentController.editStudentDetails);
router.put("/student/:email/address", studentController.addAddress);
router.delete("/student/:email/address", studentController.removeAddress); 

module.exports = router;
