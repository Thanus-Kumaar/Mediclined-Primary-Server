const {
  setResponseAsError,
  setResponseAsOk,
  setResponseAsBasRequest,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");
const DBTransactionQuery = require("../database/helper/DBTransaction.js");

const sendMail = require("../utils/email/emailGenerator.js");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const logger = require("../utils/logger.js");

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const passwordLength = 8;

function generatePassword() {
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

const studentModule = {
  addStudents: async function (emails, clinicID) {
    try {
      const cliFound = await DBSingleQuery(
        "Clinic",
        "READ",
        "SELECT Clinic_ID FROM Clinic WHERE Clinic_ID = ?",
        [clinicID]
      );
      if (cliFound !== "FAILURE") {
        if (cliFound.length == 0) {
          return setResponseAsOk("Clinic not found!");
        }
      } else {
        return setResponseAsError("Internal Server Error!");
      }
      let queries = [];
      for (const email of emails) {
        // Generate random password and hash it
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // send mail and check if the mail has been sent, else revert.

        const response = await sendMail(email, "Welcome", {
          password: password,
        });

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
      const transactionResult = await DBTransactionQuery(
        ["User", "Patient"],
        "WRITE",
        queries
      );

      if (transactionResult !== "FAILURE") {
        return setResponseAsOk("Students added to database successfully!");
      } else {
        return setResponseAsError("Failed to add students to the database!");
      }
    } catch (error) {
      logger.error({ message: "Internal server error", error: error });
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
      const response = await sendMail(email, "resetPassword", {
        password: newPassword,
      });
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
      const newPassword = generatePassword();
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      // send mail containing new password
      const response = await sendMail(email, "resetPassword", {
        password: newPassword,
      });
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
  editStudentDetails: async function (email, name, age, rollNo, gender, bloodGroup) {
    try {
      const updateDetails = await DBSingleQuery(
        "Patient",
        "WRITE",
        `UPDATE Patient SET Name = ?, Age = ?, Roll_number = ? , Gender = ?, Blood_Group = ?WHERE Email = ?`,
        [name, age, rollNo, gender, bloodGroup, email]
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
  studentDetailsByRollNo: async function (rollNo) {
    try {
      const details = await DBSingleQuery(
        "Patient",
        "READ",
        "SELECT * FROM Patient WHERE Roll_number = ?",
        [rollNo]
      );
      if (details != "FAILURE") {
        return setResponseAsOk(details);
      } else {
        return setResponseAsError("Failed to fetch student!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in studentDetailsByRollNo: " + err.message
      );
    }
  },
  checkStudent: async function (email) {
    try {
      const student = await DBSingleQuery(
        "User",
        "READ",
        "SELECT * FROM User WHERE Email = ?",
        [email]
      );
      if (student !== "FAILURE") {
        if (!student.length) {
          return setResponseAsBasRequest("Student not found in database!");
        }
        return setResponseAsOk("Student is present!");
      } else {
        return setResponseAsError("Failed to fetch student!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in checking if student is present: " + err.message
      );
    }
  },
};

module.exports = studentModule;
