const express = require("express");
const studentController = require("../controllers/studentController.js");

const router = express.Router();

const { authorizeRole } = require("../middlewares/webTokenValidator.js");

// only for admins
router
  .route("/students", authorizeRole(["A"]))
  .get(studentController.getAllStudents)
  .post(studentController.addStudents)
  .delete(studentController.deleteStudents);

router.put(
  "/password",
  authorizeRole(["A"]),
  studentController.updateStudentPassword
);
router.put(
  "/resetPassword",
  authorizeRole(["A"]),
  studentController.resetStudentPassword
); // Admin can reset a student's password and send via email.

// for students dashboard
router.get("/", authorizeRole(["S"]), studentController.studentDetails);
router.put("/", authorizeRole(["S"]), studentController.editStudentDetails);
router.put(
  "/:email/address",
  authorizeRole(["S"]),
  studentController.addAddress
);
router.delete(
  "/:email/address",
  authorizeRole(["S"]),
  studentController.removeAddress
);
router.get(
  "/rollno",
  authorizeRole(["S", "C"]),
  studentController.studentDetailsByRollNo
);
router.get("/check",studentController.checkStudent)

module.exports = router;
