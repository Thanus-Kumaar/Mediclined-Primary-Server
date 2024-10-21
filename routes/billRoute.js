const express = require("express");
const billController = require("../controllers/billController.js");

const router = express.Router();

router.get("/getBill", billController.getBill); // for individaul students or bill
router.get("/getBillForStudent", billController.getBillForStudent);
router.get("/getBillsForPharmacy", billController.getBillsForPharmacy);
router.post("/createBill", billController.createBill); // should get all the medicines and quantity of each and should populate the bill, billContainsMedicine and the order table
router.delete("/deleteBill", billController.deleteBill); // should be able to delete only if the status in order is not OUT.
router.put("/updateOrderStatus", billController.updateOrderStatus); // should contain bill ID
router.post("/sendOTP", billController.sendOTP);
router.post("/checkOTP", billController.checkOTP);
router.delete("/deleteBillAndOrder", billController.deleteBillAndOrder); // after the completion of the order, the data of bill and order should be removes..can be kept included in checkOTP itself.

module.exports = router;
