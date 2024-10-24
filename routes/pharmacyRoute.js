const express = require("express");

const pharmacyController = require("../controllers/pharmacyController.js");

const { authorizeRole } = require("../middlewares/webTokenValidator.js");

const router = express.Router();

router.get(
  "/products",
  authorizeRole(["S", "C"]),
  pharmacyController.getProductsInPharmacy
);
router.get(
  "/product/:productID",
  authorizeRole(["S", "C"]),
  pharmacyController.getProduct
);
router.post(
  "/Addproduct",
  authorizeRole(["C", "A"]),
  pharmacyController.addProduct
);
router.post(
  "/product",
  authorizeRole(["C", "A"]),
  pharmacyController.addProductToPharmacyWithStock
);
router.put(
  "/Editproduct",
  authorizeRole(["C", "A"]),
  pharmacyController.editProduct
);
router.put(
  "/product/stock",
  authorizeRole(["C", "A"]),
  pharmacyController.updateStock
);
router.delete(
  "/:clinicID/product/:productID",
  authorizeRole(["C", "A"]),
  pharmacyController.deleteProductInPharmacy
);
router.delete(
  "/deleteProduct/:productID",
  authorizeRole(["A"]),
  pharmacyController.deleteProduct
);
router
  .route("/queue", authorizeRole(["C"]))
  .get(authorizeRole(["D"]), pharmacyController.getStudentsQueue)
  .post(pharmacyController.addStudentToQueue)
  .delete(authorizeRole(["D"]), pharmacyController.removeStudentFromQueue);

module.exports = router;
