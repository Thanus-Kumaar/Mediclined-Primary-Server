const {
  setResponseAsError,
  setResponseAsOk,
  setResponseAsBasRequest,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");

require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authModule = {
  login: async function (email, password) {
    try {
      const user = await DBSingleQuery(
        "User",
        "READ",
        "SELECT * FROM User WHERE Email = ?",
        [email]
      );
      console.log(user);

      if (user == "FAILURE") {
        return setResponseAsError("Internal Server Error");
      }
      if (user.length == 0) {
        return setResponseAsOk("User not found!");
      } else {
        const isPasswordMatch = await bcrypt.compare(
          password,
          user[0].Password
        );
        if (!isPasswordMatch) {
          return setResponseAsBasRequest("Incorrect password for the user!");
        } else {
          let token;
          if (user[0].Role == "S") {
            const student = await DBSingleQuery(
              "Patient",
              "READ",
              "SELECT Clinic_ID FROM Patient WHERE Email = ?",
              [email]
            );
            if (student != "FAILURE") {
              token = jwt.sign(
                {
                  email: user[0].Email,
                  role: user[0].Role,
                  ClinicID: student[0].Clinic_ID,
                },
                process.env.SEC_KEY,
                { expiresIn: "1h" } // Token expires in 1 hour
              );
              return setResponseAsOk({ token: token, role: user[0].Role, ClinicID: student[0].Clinic_ID });
            } else {
              return setResponseAsError("Internal server error");
            }
          } else if (user[0].Role == "D") {
            const doc = await DBSingleQuery(
              "Doctor",
              "READ",
              "SELECT Clinic_ID FROM Doctor WHERE Email = ?",
              [email]
            );
            if (doc != "FAILURE") {
              token = jwt.sign(
                {
                  email: user[0].Email,
                  role: user[0].Role,
                  ClinicID: doc[0].Clinic_ID,
                },
                process.env.SEC_KEY,
                { expiresIn: "1h" } // Token expires in 1 hour
              );
              return setResponseAsOk({ token: token, role: user[0].Role, ClinicID: doc[0].Clinic_ID });
            } else {
              return setResponseAsError("Internal server error");
            }
          } else {
            token = jwt.sign(
              { email: user[0].Email, role: user[0].Role },
              process.env.SEC_KEY,
              { expiresIn: "1h" } // Token expires in 1 hour
            );
            return setResponseAsOk({ token: token, role: user[0].Role });
          }
        }
      }
    } catch (err) {
      return setResponseAsError("Error in login: " + err.message);
    }
  },

  clinicLogin: async function (id, password) {
    try {
      const clinic = await DBSingleQuery(
        "Clinic",
        "READ",
        "SELECT * FROM Clinic WHERE Clinic_ID = ?",
        [id]
      );
      console.log(clinic);

      if (clinic == "FAILURE") {
        return setResponseAsError("Internal Server Error");
      }
      if (clinic.length == 0) {
        return setResponseAsOk("Clinic not found!");
      } else {
        const isPasswordMatch = await bcrypt.compare(
          password,
          clinic[0].Password
        );
        if (!isPasswordMatch) {
          return setResponseAsBasRequest("Incorrect password for the clinic!");
        } else {
          const token = jwt.sign(
            { ID: clinic[0].Clinic_ID, role: "C" },
            process.env.SEC_KEY,
            { expiresIn: "1h" } // Token expires in 1 hour
          );
          return setResponseAsOk({ token: token, role: "C" });
        }
      }
    } catch (err) {
      return setResponseAsError("Error in login: " + err.message);
    }
  },
};

module.exports = authModule;
