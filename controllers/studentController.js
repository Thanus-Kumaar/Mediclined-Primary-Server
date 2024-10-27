const validator = require("validator");
const studentModule = require("../modules/studentModule");

const studentController = {
  // Add students for a particular clinic (Admin-only)
  addStudents: async (req, res) => {
    const { emails, clinicID } = req.body;
    if (!emails || emails.length === 0 || !clinicID) {
      return res.status(400).json({
        message: "Credentials cannot be empty!",
      });
    }
    const invalidEmails = emails.filter((email) => !validator.isEmail(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({
        message: `Invalid email(s): ${invalidEmails.join(", ")}`,
      });
    }
    try {
      const response = await studentModule.addStudents(emails, clinicID);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (error) {
      return res.status(500).send({ ERR: "Error adding student" });
    }
  },

  // Delete multiple students (Admin-only)
  deleteStudents: async (req, res) => {
    const { emails } = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).json({
        message: "Credentials cannot be empty!",
      });
    }
    const invalidEmails = emails.filter((email) => !validator.isEmail(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({
        message: `Invalid email(s): ${invalidEmails.join(", ")}`,
      });
    }

    try {
      const response = await studentModule.deleteStudents(emails);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error deleting students" });
    }
  },

  // Get all students (Admin-only)
  getAllStudents: async (req, res) => {
    try {
      const response = await studentModule.getAllStudents();
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error retrieving students" });
    }
  },

  // Update student's own password
  updateStudentPassword: async (req, res) => {
    const { email, newPassword } = req.body;

    if (!validator.isEmail(email) || !newPassword || newPassword.length < 6) {
      return res.status(400).send({ ERR: "Invalid email or password" });
    }

    try {
      const response = await studentModule.updateStudentPassword(
        email,
        newPassword
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      console.log(err)
      return res.status(500).send({ ERR: "Error updating password" });
    }
  },

  // Reset student password (Admin-only)
  resetStudentPassword: async (req, res) => {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      const response = await studentModule.resetStudentPassword(email);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error resetting password" });
    }
  },

  // Get student details for their dashboard
  studentDetails: async (req, res) => {
    const { email } = req.query;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      const response = await studentModule.studentDetails(email);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error retrieving student details" });
    }
  },

  // Edit student details
  editStudentDetails: async (req, res) => {
    const { email, name, age, rollNo, gender, bloodGroup } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      const response = await studentModule.editStudentDetails(
        email,
        name,
        age,
        rollNo,
        gender,
        bloodGroup
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error updating student details" });
    }
  },

  // Add student address
  addAddress: async (req, res) => {
    const { address } = req.body;
    const { email } = req.params;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      const response = await studentModule.addAddress(email, address);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error adding address" });
    }
  },

  // Remove student address
  removeAddress: async (req, res) => {
    const { email } = req.params;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      const response = await studentModule.removeAddress(email);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error removing address" });
    }
  },
  studentDetailsByRollNo: async (req, res) => {
    const { rollNo } = req.query;
    if (!rollNo) {
      return res.status(400).send({ ERR: "Roll number is missing!" });
    }
    try {
      const response = await studentModule.studentDetailsByRollNo(rollNo);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res
        .status(500)
        .send({ ERR: "Error in getting student details from roll number." });
    }
  },
  checkStudent: async (req, res)=>{
    const {email} = req.query;
    if(!email || !validator.isEmail(email)) {
      return res.status(400).send({ERR:"Incorrect email sent!"})
    }
    try{
      const response = await studentModule.checkStudent(email);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res
        .status(500)
        .send({ ERR: "Error in checking student." });
    }
  }
};

module.exports = studentController;
