const express = require("express");

const router = express.Router();

// only for admins
router.post("/addStudents") // should accept email, role (STUDENT), generate a random password and send a mail to student along with entry in database. if any of the two process fail, revert that student.
router.delete("/deleteStudent") // accept email
router.delete("/deleteStudents") // many emails
router.get("/getAllStudents"); // Admin route to get all students.
router.put("/updateStudentPassword"); // Students can update their own password.
router.put("/resetStudentPassword"); // Admin can reset a student's password and send via email.

// for students dashboard
router.get("/getStudentDetails")
router.put("/editStudentDetails")
router.put("/addAddress")
router.delete("/removeAddress") // there can be only one address for a student

module.exports = router;
