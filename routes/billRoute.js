const express = require("express");
const billController = require("../controllers/billController.js");

const { authorizeRole } = require("../middlewares/webTokenValidator.js");

const router = express.Router();

router.get("/:billID", authorizeRole(["S", "C"]), billController.getBill); // for individaul students or bill

router.get(
  "/billForStudent",
  authorizeRole(["S", "C"]),
  billController.getBillForStudent
);

router.get(
  "/billsForPharmacy/:clinicID",
  authorizeRole(["C"]),
  billController.getBillsForPharmacy
);

router.post("", authorizeRole(["S"]), billController.createBill); // should get all the medicines and quantity of each and should populate the bill, billContainsMedicine and the order table
router.delete("/:billID", authorizeRole(["S"]), billController.deleteBill); // should be able to delete only if the status in order is not OUT.

router.put(
  "/updateStatus",
  authorizeRole(["C"]),
  billController.updateOrderStatus
); // should contain bill ID

router.post("/otp/send", authorizeRole(["C"]), billController.sendOTP);
router.post("/otp/verify", authorizeRole(["C"]), billController.checkOTP);

router.delete(
  "/:billID/complete",
  authorizeRole(["C"]),
  billController.deleteBillAndOrder
); // after the completion of the order, the data of bill and order should be removes..can be kept included in checkOTP itself.

module.exports = router;
