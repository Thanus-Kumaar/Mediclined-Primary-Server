const validator = require("validator.js");
const authModule = require("../modules/authModule.js");

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!password || !email || !validator.isEmail(email)) {
      res.status(400).send({ ERR: "Email or Password is in wrong format!" });
    }
    try {
      const response = await authModule.login(email, password);
      res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      res.status(500).send({ ERR: "Internal Server Error" });
    }
  },
  clinicLogin:  async (req, res) => {
    const { id, password } = req.body;
    if (!password || !id || !validator.isInt(id)) {
      res.status(400).send({ ERR: "Id or Password is in wrong format!" });
    }
    try {
      const response = await authModule.clinicLogin(id, password);
      res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      res.status(500).send({ ERR: "Internal Server Error" });
    }
  },
};

module.exports = authController;
