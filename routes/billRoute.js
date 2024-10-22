const express = require("express");
const billController = require("../controllers/billController.js");

const router = express.Router();

router.get("/:billID", billController.getBill); // for individaul students or bill
router.get("/billForStudent", billController.getBillForStudent);
router.get("/billsForPharmacy/:clinicID", billController.getBillsForPharmacy);
router.post("", billController.createBill); // should get all the medicines and quantity of each and should populate the bill, billContainsMedicine and the order table
router.delete("/:billID", billController.deleteBill); // should be able to delete only if the status in order is not OUT.
router.put("/updateStatus", billController.updateOrderStatus); // should contain bill ID
router.post("/otp/send", billController.sendOTP);
router.post("/otp/verify", billController.checkOTP);
router.delete("/:billID/complete", billController.deleteBillAndOrder); // after the completion of the order, the data of bill and order should be removes..can be kept included in checkOTP itself.

module.exports = router;
