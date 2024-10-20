const validator = require("validator.js");

const billController = {
  // Get individual bill for a student or specific bill
  getBill: async (req, res) => {
    const { billID, email } = req.query;

    if (!billID || !email || !validator.isEmail(email)) {
      return res.status(400).send({ ERR: "Invalid billID or email!" });
    }

    try {
      const bill = await pharmacyModule.getBill(billID, email);
      return res.status(200).send(bill);
    } catch (err) {
      return res.status(500).send({ ERR: "Error retrieving bill!" });
    }
  },

  // Get all bills related to a specific pharmacy/clinic
  getBillsForPharmacy: async (req, res) => {
    const { clinicID } = req.query;

    if (!clinicID || !validator.isInt(clinicID, { min: 1 })) {
      return res.status(400).send({ ERR: "Invalid clinicID!" });
    }

    try {
      const bills = await pharmacyModule.getBillsForPharmacy(clinicID);
      return res.status(200).send(bills);
    } catch (err) {
      return res.status(500).send({ ERR: "Error retrieving bills!" });
    }
  },

  // Create a bill with all medicines and quantities
  createBill: async (req, res) => {
    const { clinicID, price, quantity, medicines } = req.body;

    if (
      !clinicID ||
      !price ||
      !quantity ||
      !Array.isArray(medicines) ||
      medicines.length === 0
    ) {
      return res.status(400).send({ ERR: "Invalid or missing fields!" });
    }

    try {
      const billID = await pharmacyModule.createBill(clinicID, price, quantity);

      for (const medicine of medicines) {
        await pharmacyModule.addMedicineToBill(
          billID,
          medicine.medicineID,
          medicine.quantity
        );
      }

      // Insert into order table
      await pharmacyModule.createOrder(billID, "PENDING", null);

      return res.status(201).send({ message: "Bill created successfully!" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error creating bill!" });
    }
  },

  // Delete a bill only if order status is not "OUT"
  deleteBill: async (req, res) => {
    const { billID } = req.body;

    if (!billID || !validator.isInt(billID, { min: 1 })) {
      return res.status(400).send({ ERR: "Invalid billID!" });
    }

    try {
      const order = await pharmacyModule.getOrderStatus(billID);

      if (order.status === "OUT") {
        return res
          .status(400)
          .send({ ERR: "Cannot delete a completed order!" });
      }

      await pharmacyModule.deleteBill(billID);
      await pharmacyModule.deleteOrder(billID);

      return res
        .status(200)
        .send({ message: "Bill and Order deleted successfully!" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error deleting bill!" });
    }
  },

  // Update order status (needs billID)
  updateOrderStatus: async (req, res) => {
    const { billID, status } = req.body;

    if (
      !billID ||
      !status ||
      !validator.isIn(status, ["PENDING", "OUT"]) ||
      !!validator.isInt(billID)
    ) {
      return res.status(400).send({ ERR: "Invalid status or billID!" });
    }

    try {
      await pharmacyModule.updateOrderStatus(billID, status);
      return res
        .status(200)
        .send({ message: "Order status updated successfully!" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error updating order status!" });
    }
  },

  // Send OTP for order verification
  sendOTP: async (req, res) => {
    const { billID } = req.body;

    if (!billID || !validator.isInt(billID, { min: 1 })) {
      return res.status(400).send({ ERR: "Invalid billID!" });
    }

    try {
      const otp = otpService.generateOTP();
      await pharmacyModule.updateOrderOTP(billID, otp);

      // Assume sendOTPViaEmail is a function to send the OTP
      await otpService.sendOTPViaEmail(billID, otp);

      return res.status(200).send({ message: "OTP sent successfully!" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error sending OTP!" });
    }
  },

  // Check if the provided OTP is valid
  checkOTP: async (req, res) => {
    const { billID, otp } = req.body;

    if (
      !billID ||
      !otp ||
      !validator.isInt(billID, { min: 1 }) ||
      !validator.isInt(otp)
    ) {
      return res.status(400).send({ ERR: "Invalid billID or OTP!" });
    }

    try {
      const isValidOTP = await pharmacyModule.checkOTP(billID, otp);

      if (!isValidOTP) {
        return res.status(400).send({ ERR: "Invalid OTP!" });
      }

      return res.status(200).send({ message: "OTP verified successfully!" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error verifying OTP!" });
    }
  },

  // Delete bill and order after completion
  deleteBillAndOrder: async (req, res) => {
    const { billID } = req.body;

    if (!billID || !validator.isInt(billID, { min: 1 })) {
      return res.status(400).send({ ERR: "Invalid billID!" });
    }

    try {
      const order = await pharmacyModule.getOrderStatus(billID);

      if (order.status !== "COMPLETED") {
        return res
          .status(400)
          .send({ ERR: "Cannot delete incomplete orders!" });
      }

      await pharmacyModule.deleteBill(billID);
      await pharmacyModule.deleteOrder(billID);

      return res
        .status(200)
        .send({ message: "Bill and Order deleted successfully!" });
    } catch (err) {
      return res.status(500).send({ ERR: "Error deleting bill and order!" });
    }
  },
};

module.exports = billController;
