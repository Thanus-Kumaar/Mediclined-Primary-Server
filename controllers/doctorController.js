const validator = require("validator");
const doctorModule = require("../modules/doctorModule.js");

const doctorController = {
  getDoctorDetails: async (req, res) => {
    const { email } = req.params;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email!" });
    }
    try {
      const response = await doctorModule.getDoctorDetails(email);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error retrieving doctor details!" });
    }
  },
  deleteDoctor: async (req, res) => {
    const { email } = req.params;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email!" });
    }
    try {
      const response = await doctorModule.deleteDoctor(email);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error deleting doctor!" });
    }
  },
  addDoctor: async (req, res) => {
    const { email, name, age, spec, qualification, password, clinicID } =
      req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email!" });
    }
    if (!name || !age || !spec || !qualification || !clinicID || !password) {
      return res.status(400).send({ ERR: "All fields are required!" });
    }
    if (!validator.isInt(age.toString()) || age <= 0) {
      return res.status(400).send({ ERR: "Invalid age!" });
    }

    try {
      const response = await doctorModule.addDoctor(
        email,
        name,
        age,
        spec,
        qualification,
        password,
        clinicID
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error adding doctor!" });
    }
  },
  editDoctor: async (req, res) => {
    const { email, name, age, spec, qualification } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid email!" });
    }
    if (!name || !age || !spec || !qualification) {
      return res.status(400).send({ ERR: "All fields are required!" });
    }
    if (!validator.isInt(age.toString()) || age <= 0) {
      return res.status(400).send({ ERR: "Invalid age!" });
    }

    try {
      const response = await doctorModule.editDoctor(
        email,
        name,
        age,
        spec,
        qualification
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error editing doctor details!" });
    }
  },
  getAllDoctors: async (req, res) => {
    try {
      const response = await doctorModule.getAllDoctors();
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error retrieving doctors!" });
    }
  },
};

module.exports = doctorController;
