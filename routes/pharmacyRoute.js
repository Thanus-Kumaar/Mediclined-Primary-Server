const express = require("express");

const pharmacyController = require("../controllers/pharmacyController.js");

const router = express.Router();

router.get("/products", pharmacyController.getProductsInPharmacy);
router.get("/product/:productID", pharmacyController.getProduct);
router.post("/Addproduct", pharmacyController.addProduct);
router.post("/product", pharmacyController.addProductToPharmacyWithStock);
router.put("/Editproduct", pharmacyController.editProduct);
router.put("/product/stock", pharmacyController.updateStock);
router.delete(
  "/:clinicID/product/:productID",
  pharmacyController.deleteProductInPharmacy
);
router.delete("/deleteProduct/:productID", pharmacyController.deleteProduct);
router
  .route("/queue")
  .get(pharmacyController.getStudentsQueue)
  .post(pharmacyController.addStudentToQueue)
  .delete(pharmacyController.removeStudentFromQueue)

module.exports = router;
