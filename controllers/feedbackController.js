const validator = require("validator.js");
const feedbackModule = require("../modules/feedbackModule.js");

const feedbackController = {
  getFeedback: async (req, res) => {
    const { clinicID } = req.query;
    if (!clinicID || !validator.isInt(clinicID)) {
      return res.status(400).send({ BAD_REQUEST: "Invalid clinic ID" });
    }
    try {
      const response = await feedbackModule.getFeedback(clinicID);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error fetching feedback" });
    }
  },
  sendFeedback: async (req, res) => {
    const { clinicID, title, description, category } = req.body;
    if (
      !clinicID ||
      !title ||
      !description ||
      !category ||
      !validator.isInt(clinicID)
    ) {
      return res.status(400).send({ BAD_REQUEST: "Invalid credentials" });
    }
    try {
      const response = await feedbackModule.sendFeedback(clinicID, title, description, category);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      return res.status(500).send({ ERR: "Error in sending feedback" });
    }
  },
};

module.exports = feedbackController;
