const express = require("express");
const studentController = require("../controllers/studentController.js");

const router = express.Router();

// only for admins
router
  .route("/students")
  .get(studentController.getAllStudents)
  .post(studentController.addStudents)
  .delete(studentController.deleteStudents);

router.put("/password", studentController.updateStudentPassword);
router.put("/resetPassword", studentController.resetStudentPassword); // Admin can reset a student's password and send via email.

// for students dashboard
router.get("/", studentController.studentDetails);
router.put("/", studentController.editStudentDetails);
router.put("/:email/address", studentController.addAddress);
router.delete("/:email/address", studentController.removeAddress); 
router.get("/rollno", studentController.studentDetailsByRollNo);

module.exports = router;
