const {
  setResponseAsError,
  setResponseAsOk,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");
const DBTransactionQuery = require("../database/helper/DBTransaction.js");

const bcrypt = require("bcrypt");

const studentModule = {
  addStudents: async function (emails, clinicID) {
    try {
      for (const email of emails) {
        // Generate random password and hash it
        const password = crypto.randomBytes(8).toString("hex");
        const hashedPassword = await bcrypt.hash(password, 10);

        // send mail and check if the mail has been sent, else revert.

        // Prepare the queries to insert the student into User and Patient tables
        queries.push({
          queryString: `INSERT INTO User (Email, Password, Role) VALUES (?, ?, 'S')`,
          queryParams: [email, hashedPassword],
        });

        queries.push({
          queryString: `INSERT INTO Patient (Email, Clinic_ID) VALUES (?, ?)`,
          queryParams: [email, clinicID],
        });
      }

      // Execute the transaction to insert all students
      const transactionResult = await DBTransactionQuery(queries);

      if (transactionResult !== "FAILURE") {
        return setResponseAsOk("Students added to database successfully!");
      } else {
        return setResponseAsError("Failed to add students to the database!");
      }
    } catch (error) {
      return setResponseAsError("Error in addStudents: " + error.message);
    }
  },
  deleteStudents: async function (emails) {
    try {
      const deleteQuery = await DBSingleQuery(
        ["User", "Patient"],
        "WRITE",
        `DELETE FROM User WHERE Email IN (?)`,
        [emails]
      );

      if (deleteQuery != "FAILURE") {
        return setResponseAsOk("Students deleted successfully!");
      } else {
        return setResponseAsError("Failed to delete students!");
      }
    } catch (err) {
      return setResponseAsError("Error in deleteStudents: " + err.message);
    }
  },
  getAllStudents: async function () {
    try {
      const students = await DBSingleQuery(
        "User",
        "READ",
        `SELECT Email FROM User WHERE Role = ?`,
        ["S"]
      );

      if (students != "FAILURE") {
        return setResponseAsOk(students);
      } else {
        return setResponseAsError("Failed to retrieve students!");
      }
    } catch (err) {
      return setResponseAsError("Error in getAllStudents: " + err.message);
    }
  },
  updateStudentPassword: async function (email, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // send mail containing the updated password
      const updatePassword = await DBSingleQuery(
        "User",
        "WRITE",
        `UPDATE User SET Password = ? WHERE Email = ?`,
        [hashedPassword, email]
      );
      if (updatePassword != "FAILURE") {
        return setResponseAsOk("Password updated successfully!");
      } else {
        return setResponseAsError("Failed to update password!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in updateStudentPassword: " + err.message
      );
    }
  },
  resetStudentPassword: async function (email) {
    try {
      // change this to generate a random alphanumeric password
      const newPassword = Math.random().toString(36).slice(-8);
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      // send mail containing new password
      const updatePassword = await DBSingleQuery(
        "User",
        "WRITE",
        `UPDATE User SET Password = ? WHERE Email = ?`,
        [hashedNewPassword, email]
      );

      if (updatePassword != "FAILURE") {
        return setResponseAsOk(
          "Password reset successfully! New password: " + newPassword
        );
      } else {
        return setResponseAsError("Failed to reset password!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in resetStudentPassword: " + err.message
      );
    }
  },
  studentDetails: async function (email) {
    try {
      const student = await DBSingleQuery(
        "Patient",
        "READ",
        `SELECT Email, Name, Age, Gender, Blood_Group, Roll_number, Address FROM Patient WHERE Email = ?`,
        [email]
      );

      if (student != "FAILURE") {
        return setResponseAsOk(student);
      } else {
        return setResponseAsError("Failed to retrieve student details!");
      }
    } catch (err) {
      return setResponseAsError("Error in studentDetails: " + err.message);
    }
  },
  editStudentDetails: async function (email, name, age, gender, bloodGroup) {
    try {
      const updateDetails = await DBSingleQuery(
        "Patient",
        "WRITE",
        `UPDATE Patient SET Name = ?, Age = ?, Gender = ?, Blood_Group = ? WHERE Email = ?`,
        [name, age, gender, bloodGroup, email]
      );

      if (updateDetails != "FAILURE") {
        return setResponseAsOk("Student details updated successfully!");
      } else {
        return setResponseAsError("Failed to update student details!");
      }
    } catch (err) {
      return setResponseAsError("Error in editStudentDetails: " + err.message);
    }
  },
  addAddress: async function (email, address) {
    try {
      const addAddress = await DBSingleQuery(
        "Patient",
        "WRITE",
        `UPDATE Patient SET Address = ? WHERE Email = ?`,
        [address, email]
      );

      if (addAddress != "FAILURE") {
        return setResponseAsOk("Address added successfully!");
      } else {
        return setResponseAsError("Failed to add address!");
      }
    } catch (err) {
      return setResponseAsError("Error in addAddress: " + err.message);
    }
  },
  removeAddress: async function (email) {
    try {
      const removeAddress = await DBSingleQuery(
        "Patient",
        "WRITE",
        `UPDATE Patient SET Address = NULL WHERE Email = ?`,
        [email]
      );

      if (removeAddress != "FAILURE") {
        return setResponseAsOk("Address removed successfully!");
      } else {
        return setResponseAsError("Failed to remove address!");
      }
    } catch (err) {
      return setResponseAsError("Error in removeAddress: " + err.message);
    }
  },
};

module.exports = studentModule;