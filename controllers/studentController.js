const validator = require("validator.js");

const studentController = {
  // Add students (Admin-only)
  addStudents: async (req, res) => {
    const { email, role } = req.body;

    if (!validator.isEmail(email) || role !== "STUDENT") {
      return res.status(400).send({ ERR: "Invalid email or role" });
    }

    try {
      // Generate random password
      const password = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Add user to the database
      await userModule.createUser({ email, password: hashedPassword, role });

      // Send email to student
      const emailStatus = await mailService.sendEmail(
        email,
        "Welcome!",
        `Your password is: ${password}`
      );

      // If email sending fails, rollback the user entry
      if (!emailStatus) {
        await userModule.deleteUser(email);
        return res
          .status(500)
          .send({ ERR: "Failed to send email, student not added" });
      }

      res.status(200).send({ message: "Student added successfully" });
    } catch (error) {
      return res.status(500).send({ ERR: "Error adding student" });
    }
  },

  // Delete a single student (Admin-only)
  deleteStudent: async (req, res) => {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      await userModule.deleteUser(email);
      await studentModule.deleteStudent(email);
      return res.status(200).send({ message: "Student deleted successfully" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error deleting student" });
    }
  },

  // Delete multiple students (Admin-only)
  deleteStudents: async (req, res) => {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || !emails.every(validator.isEmail)) {
      return res.status(400).send({ ERR: "Invalid email list" });
    }

    try {
      for (const email of emails) {
        await userModule.deleteUser(email);
        await studentModule.deleteStudent(email);
      }
      return res.status(200).send({ message: "Students deleted successfully" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error deleting students" });
    }
  },

  // Get all students (Admin-only)
  getAllStudents: async (req, res) => {
    try {
      const students = await studentModule.getAllStudents();
      return res.status(200).send(students);
    } catch (err) {
      return res.status(500).send({ ERR: "Error retrieving students" });
    }
  },

  // Update student's own password
  updateStudentPassword: async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!validator.isEmail(email) || !newPassword || newPassword.length < 6) {
      return res.status(400).send({ ERR: "Invalid email or password" });
    }

    try {
      const user = await userModule.getUserByEmail(email);
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).send({ ERR: "Incorrect old password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userModule.updatePassword(email, hashedPassword);

      return res.status(200).send({ message: "Password updated successfully" });
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
      // Generate random password
      const password = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password in the database
      await userModule.updatePassword(email, hashedPassword);

      // Send email with new password
      const emailStatus = await mailService.sendEmail(
        email,
        "Password Reset",
        `Your new password is: ${password}`
      );

      if (!emailStatus) {
        return res.status(500).send({ ERR: "Failed to send email" });
      }

      return res.status(200).send({ message: "Password reset successfully" });
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
      const studentDetails = await studentModule.getStudentDetails(email);
      return res.status(200).send(studentDetails);
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
      await studentModule.updateStudentDetails(email, {
        name,
        age,
        gender,
        bloodGroup,
      });
      return res.status(200).send({ message: "Details updated successfully" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error updating student details" });
    }
  },

  // Add student address
  addAddress: async (req, res) => {
    const { email, address } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      await studentModule.updateAddress(email, address);
      return res
        .status(200)
        .send({ message: "Address added/updated successfully" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error adding address" });
    }
  },

  // Remove student address
  removeAddress: async (req, res) => {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email" });
    }

    try {
      await studentModule.removeAddress(email);
      return res.status(200).send({ message: "Address removed successfully" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error removing address" });
    }
  },
};

module.exports = studentController;
