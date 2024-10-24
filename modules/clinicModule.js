const {
  setResponseAsError,
  setResponseAsOk,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");

const bcrypt = require("bcrypt");

const clinicModule = {
  getClinics: async function () {
    try {
      const clinics = await DBSingleQuery(
        "Clinic",
        "READ",
        "SELECT Clinic_ID, University_Name FROM Clinic"
      );
      if (clinics != "FAILURE") {
        return setResponseAsOk(clinics);
      } else {
        return setResponseAsError("Failed to fetch clinics!");
      }
    } catch (err) {
      return setResponseAsError("Error in getClinics: " + err.message);
    }
  },
  getClinicById: async function (clinicID) {
    try {
      const clinic = await DBSingleQuery(
        "Clinic",
        "READ",
        "SELECT * FROM Clinic WHERE Clinic_ID = ?",
        [clinicID]
      );
      if (clinic != "FAILURE") {
        return setResponseAsOk(clinic);
      } else {
        return setResponseAsError("Failed to fetch clinic!");
      }
    } catch (err) {
      return setResponseAsError("Error in getClinicById: " + err.message);
    }
  },
  createClinic: async function (
    university_name,
    doctor_availability,
    password
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const created = await DBSingleQuery(
        "Clinic",
        "WRITE",
        "INSERT INTO Clinic (University_Name, Doctor_Availability, Password) VALUES (?,?,?)",
        [university_name, doctor_availability, hashedPassword]
      );
      if (created != "FAILURE") {
        return setResponseAsOk("Clinic created successfully!");
      } else {
        return setResponseAsError("Failed to create clinic!");
      }
    } catch (err) {
      return setResponseAsError("Error in createClinic: " + err.message);
    }
  },
  updateClinic: async function (clinicID, university_name, password) {
    try {
      const updated = await DBSingleQuery(
        "Clinic",
        "WRITE",
        "UPDATE Clinic SET University_Name = ?, Password = ? WHERE Clinic_ID = ?",
        [university_name, password, clinicID]
      );
      if (updated != "FAILURE") {
        return setResponseAsOk("Clinic updated successfully!");
      } else {
        return setResponseAsError("Failed to update clinic!");
      }
    } catch (err) {
      return setResponseAsError("Error in updateClinic: " + err.message);
    }
  },
  deleteClinic: async function (clinicID) {
    try {
      const deleted = await DBSingleQuery(
        "Clinic",
        "WRITE",
        "DELETE FROM Clinic WHERE Clinic_ID = ?",
        [clinicID]
      );
      if (deleted != "FAILURE") {
        return setResponseAsOk("Clinic deleted successfully!");
      } else {
        return setResponseAsError("Failed to delete clinic!");
      }
    } catch (err) {
      return setResponseAsError("Error in deleteClinic: " + err.message);
    }
  },
  checkDoctorAvailability: async function (clinicID) {
    try {
      const docAvai = await DBSingleQuery(
        "Clinic",
        "READ",
        "SELECT Doctor_Availability FROM Clinic WHERE Clinic_ID = ?",
        [clinicID]
      );
      if (docAvai != "FAILURE") {
        return setResponseAsOk(docAvai);
      } else {
        return setResponseAsError("Failed to fetch doctor availability!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in checkDoctorAvailability: " + err.message
      );
    }
  },
  updateDoctorAvailability: async function (clinicID, doctor_availability) {
    try {
      const updated = await DBSingleQuery(
        "Clinic",
        "WRITE",
        "UPDATE Clinic SET Doctor_Availability = ? WHERE Clinic_ID = ?",
        [doctor_availability, clinicID]
      );
      if (updated != "FAILURE") {
        return setResponseAsOk("Doctor availability successfully updated!");
      } else {
        return setResponseAsError("Failed to update doctor availability!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in updateDoctorAvailability: " + err.message
      );
    }
  },
};

module.exports = clinicModule;
