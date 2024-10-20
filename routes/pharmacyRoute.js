const express = require("express");

const pharmacyController = require("../controllers/pharmacyController.js");

const router = express.Router();

router.get("/getProductsInPharmacy", pharmacyController.getProductsInPharmacy);
router.get("/getProduct", pharmacyController.getProduct);
router.post("/addProduct", pharmacyController.addProduct);
router.post("/addProductToPharmacyWithStock", pharmacyController.addProductToPharmacyWithStock);
router.put("/editProduct", pharmacyController.editProduct);
router.put("/updateStock", pharmacyController.updateStock);
router.delete(
  "/deleteProductInPharmacy",
  pharmacyController.deleteProductInPharmacy
);
router.delete("/deleteProduct", pharmacyController.deleteProduct);

module.exports = router;
