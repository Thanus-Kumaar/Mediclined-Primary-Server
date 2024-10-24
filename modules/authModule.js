const {
  setResponseAsError,
  setResponseAsOk,
  setResponseAsBasRequest,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");

const jwt = require("jsonwebtoken");

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
          const token = jwt.sign(
            { email: user[0].Email, role: user[0].Role },
            process.env.SEC_KEY,
            { expiresIn: "1h" } // Token expires in 1 hour
          );
          return setResponseAsOk({ token: token, role: user[0].Role });
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
        return setResponseAsOk("clinic not found!");
      } else {
        const isPasswordMatch = await bcrypt.compare(
          password,
          clinic[0].Password
        );
        if (!isPasswordMatch) {
          return setResponseAsBasRequest("Incorrect password for the clinic!");
        } else {
          const token = jwt.sign(
            { ID: clinic[0].CLinic_ID, role: "C" },
            process.env.SEC_KEY,
            { expiresIn: "1h" } // Token expires in 1 hour
          );
          return setResponseAsOk({ token: token, role: clinic[0].Role });
        }
      }
    } catch (err) {
      return setResponseAsError("Error in login: " + err.message);
    }
  },
};

module.exports = authModule;
