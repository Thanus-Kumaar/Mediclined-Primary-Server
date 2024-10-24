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
};

module.exports = authModule;
