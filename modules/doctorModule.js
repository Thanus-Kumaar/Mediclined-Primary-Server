const {
  setResponseAsError,
  setResponseAsOk,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");
const DBTransactionQuery = require("../database/helper/DBTransaction.js");

const doctorModule = {
  getDoctorDetails: async function (email) {
    try {
      const detail = await DBSingleQuery(
        "Doctor",
        "READ",
        "SELECT * FROM Doctor WHERE Email = ?",
        [email]
      );
      if (detail != "FAILURE") {
        return setResponseAsOk(detail);
      } else {
        return setResponseAsError("Failed to fetch doctor details!");
      }
    } catch (err) {
      return setResponseAsError("Error in getDoctorDetails: " + err.message);
    }
  },
  deleteDoctor: async function (email) {
    try {
      const deleted = await DBSingleQuery(
        "Doctor",
        "WRITE",
        "DELETE FROM Doctor WHERE Email = ?",
        [email]
      );
      if (deleted != "FAILURE") {
        return setResponseAsOk("Doctor deleted successfully!");
      } else {
        return setResponseAsError("Failed to delete doctor!");
      }
    } catch (err) {
      return setResponseAsError("Error in deleteDoctor: " + err.message);
    }
  },
  // should add details in User table as well as Doctor tabel, use DBTransactionQuery for this
  addDoctor: async function (
    email,
    name,
    age,
    spec,
    qualification,
    password,
    clinicID
  ) {
    try {
      const transaction = await DBTransactionQuery(
        ["User", "Doctor"],
        "WRITE",
        [
          {
            queryString: "INSERT INTO User VALUES (?,?,'D')",
            queryParams: [email, password],
          },
          {
            queryString:
              "INSERT INTO Doctor (Name, Email, Specialization, Qualification, Age, Clinic_ID) VALUES (?,?,?,?,?,?)",
            queryParams: [name, email, spec, qualification, age, clinicID],
          },
        ]
      );
      if (transaction != "FAILURE") {
        return setResponseAsOk("Doctor added successfully!");
      } else {
        return setResponseAsError("Failed to add doctor!");
      }
    } catch (err) {
      return setResponseAsError("Error in addDoctor: " + err.message);
    }
  },
  editDoctor: async function (email, name, age, spec, qualification) {
    try {
      const updateResult = await DBSingleQuery(
        "Doctor",
        "WRITE",
        "UPDATE Doctor SET Name = ?, Age = ?, Specialization = ?, Qualification = ? WHERE Email = ?",
        [name, age, spec, qualification, email]
      );
      if (updateResult != "FAILURE") {
        return setResponseAsOk("Doctor details updated successfully!");
      } else {
        return setResponseAsError("Failed to update doctor details!");
      }
    } catch (err) {
      return setResponseAsError("Error in editDoctor: " + err.message);
    }
  },
  getAllDoctors: async function (clinicID) {
    try {
      const doctors = await DBSingleQuery(
        "Doctor",
        "READ",
        "SELECT * FROM Doctor WHERE Clinic_ID = ?",
        [clinicID]
      );
      if (doctors != "FAILURE") {
        return setResponseAsOk(doctors);
      } else {
        return setResponseAsError("Failed to retrieve doctors!");
      }
    } catch (err) {
      return setResponseAsError("Error in getAllDoctors: " + err.message);
    }
  },
};

module.exports = doctorModule;
