const {
  setResponseAsError,
  setResponseAsOk,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");

const feedbackModule = {
  getFeedback: async function (clinicID) {
    try {
      const feedbacks = await DBSingleQuery(
        "Feedback",
        "READ",
        "SELECT * FROM Feedback WHERE Clinic_ID = ?",
        [clinicID]
      );
      if (feedbacks != "FAILURE") {
        return setResponseAsOk(feedbacks);
      } else {
        return setResponseAsError("Failed to fetch feedbacks!");
      }
    } catch (err) {
      return setResponseAsError("Error in getFeedback: " + err.message);
    }
  },
  sendFeedback: async function (clinicID, title, description, category) {
    try {
      const feedback = await DBSingleQuery(
        "Feedback",
        "WRITE",
        "INSERT INTO Feedback (Clinic_ID, Title, Description, Category, Creation_date) VALUES (?,?,?,?,CURDATE())",
        [clinicID, title, description, category]
      );
      if (feedback != "FAILURE") {
        return setResponseAsOk("Feedback was sent successfully!");
      } else {
        return setResponseAsError("Failed to send feedback!");
      }
    } catch (err) {
      return setResponseAsError("Error in sendFeedback: " + err.message);
    }
  },
};

module.exports = feedbackModule;
