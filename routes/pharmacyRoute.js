const express = require("express");

const router = express.Router();

router.get("/getProductsInPharmacy")
router.get("/getProduct")
router.post("/addProduct")
router.put("/editProduct")
router.put("/updateStock")
router.delete("/deleteProductInPharmacy")
router.delete("/deleteProduct")

module.exports = router;
