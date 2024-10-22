const validator = require("validator.js");
const studentModule = require("../modules/studentModule");

const studentController = {
  // Add students for a particular clinic (Admin-only)
  addStudents: async (req, res) => {
    const { emails, clinicID } = req.body;
    if (!emails || emails.length === 0) {
      return res.status(400).json({
        message: "Emails cannot be empty!",
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

    if (!emails || !Array.isArray(emails) || !emails.every(validator.isEmail)) {
      return res.status(400).send({ ERR: "Invalid email list" });
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
      const response = await userModule.updateStudentPassword(
        email,
        newPassword
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
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
      const response = await userModule.resetStudentPassword(email);
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
    const { email, name, age, gender, bloodGroup } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      const response = await studentModule.editStudentDetails(
        email,
        name,
        age,
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
};

module.exports = studentController;
