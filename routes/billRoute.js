const express = require("express");

const router = express.Router();

router.get("/getBill") // for individaul students or bill
router.get("/getBillsForPharmacy")
router.post("/createBill") // should get all the medicines and quantity of each and should populate the bill, billContainsMedicine and the order table
router.delete("/deleteBill") // should be able to delete only if the status in order is not OUT.
router.put("/updateOrderStatus") // should contain bill ID
router.post("/sendOTP")
router.post("/checkOTP")
router.delete("/deleteBillAndOrder") // after the completion of the order, the data of bill and order should be removes..can be kept included in checkOTP itself.

module.exports = router;
