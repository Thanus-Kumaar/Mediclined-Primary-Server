const validator = require("validator");
const authModule = require("../modules/authModule.js");

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!password || !email || !validator.isEmail(email)) {
      return res
        .status(400)
        .send({ ERR: "Email or Password is in wrong format!" });
    }
    try {
      const response = await authModule.login(email, password);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },
  clinicLogin: async (req, res) => {
    const { id, password } = req.body;
    console.log(typeof id);
    if (!password || !id || !validator.isNumeric(id)) {
      return res
        .status(400)
        .send({ ERR: "Id or Password is in wrong format!" });
    }
    try {
      const response = await authModule.clinicLogin(parseInt(id), password);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },
};

module.exports = authController;
