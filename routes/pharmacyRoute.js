const express = require("express");

const pharmacyController = require("../controllers/pharmacyController.js");

const router = express.Router();

router.get("/pharmacy/products", pharmacyController.getProductsInPharmacy);
router.get("/product/:productID", pharmacyController.getProduct);
router.post("/product", pharmacyController.addProduct);
router.post("/pharmacy/product", pharmacyController.addProductToPharmacyWithStock);
router.put("/product", pharmacyController.editProduct);
router.put("/product/stock", pharmacyController.updateStock);
router.delete(
  "/pharmacy/:clinicID/product/:productID",
  pharmacyController.deleteProductInPharmacy
);
router.delete("/product/:productID", pharmacyController.deleteProduct);

module.exports = router;
