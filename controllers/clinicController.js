const validator = require("validator");
const clinicModule = require("../modules/clinicModule.js");

const clinicController = {
  getClinics: async (req, res) => {
    try {
      const response = await clinicModule.getClinics();
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error fetching clinics" });
    }
  },
  getClinicById: async (req, res) => {
    const { clinicID } = req.params;
    if (!clinicID || !validator.isInt(clinicID)) {
      return res.status(400).send({ ERR: "Invalid clinic ID" });
    }
    try {
      const response = await clinicModule.getClinicById(clinicID);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error fetching clinics" });
    }
  },
  createClinic: async (req, res) => {
    const { university_name, password } = req.body;
    if (
      !university_name ||
      !password
    ) {
      return res.status(400).send({ ERR: "Missing or invalid clinic details" });
    }

    try {
      const response = await clinicModule.createClinic(
        university_name,
        password
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error creating clinic" });
    }
  },

  // Update a clinic
  updateClinic: async (req, res) => {
    const { clinicID } = req.params;
    const { university_name, password } = req.body;

    if (
      !clinicID ||
      !validator.isInt(clinicID) ||
      !university_name ||
      !password
    ) {
      return res.status(400).send({ ERR: "Invalid input for updating clinic" });
    }

    try {
      const response = await clinicModule.updateClinic(
        clinicID,
        university_name,
        password
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error updating clinic" });
    }
  },

  // Delete a clinic
  deleteClinic: async (req, res) => {
    const { clinicID } = req.params;
    if (!clinicID || !validator.isInt(clinicID)) {
      return res.status(400).send({ ERR: "Invalid clinic ID" });
    }

    try {
      const response = await clinicModule.deleteClinic(clinicID);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error deleting clinic" });
    }
  },

  // Check doctor availability
  checkDoctorAvailability: async (req, res) => {
    const { clinicID } = req.params;
    if (!clinicID || !validator.isInt(clinicID)) {
      return res.status(400).send({ ERR: "Invalid clinic ID" });
    }

    try {
      const response = await clinicModule.checkDoctorAvailability(clinicID);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res
        .status(500)
        .send({ ERR: "Error fetching doctor availability" });
    }
  },

  // Update doctor availability
  updateDoctorAvailability: async (req, res) => {
    const { clinicID } = req.body;
    const { doctor_availability } = req.body;

    if (
      !clinicID ||
      !validator.isInt(clinicID) ||
      typeof doctor_availability !== "boolean"
    ) {
      return res
        .status(400)
        .send({ ERR: "Invalid clinic ID or doctor availability" });
    }

    try {
      const response = await clinicModule.updateDoctorAvailability(
        clinicID,
        doctor_availability
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res
        .status(500)
        .send({ ERR: "Error updating doctor availability" });
    }
  },
};

module.exports = clinicController;
