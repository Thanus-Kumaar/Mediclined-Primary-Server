const validator = require("validator.js");
const pharmacyModule = require("../modules/pharmacyModule.js");

const pharmacyController = {
  // Get all products in a specific pharmacy
  getProductsInPharmacy: async (req, res) => {
    const { clinicID } = req.query;

    // Validate clinicID
    if (!clinicID || !validator.isInt(clinicID)) {
      return res.status(400).send({ ERR: "Invalid or missing clinicID" });
    }

    try {
      const response = await pharmacyModule.getProductsInPharmacy(clinicID);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      logger.error({
        message: "Error occurred in pharmacyController : getProductsInPharmacy",
        error: err,
      });
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },

  // Get a specific product by ID
  getProduct: async (req, res) => {
    const { productID } = req.params;

    // Validate productID
    if (!productID || !validator.isInt(productID)) {
      return res.status(400).send({ ERR: "Invalid or missing productID" });
    }

    try {
      const response = await pharmacyModule.getProduct(productID);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      logger.error({
        message: "Error occurred in pharmacyController : getProduct",
        error: err,
      });
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },

  // Add a new product to the Medicine table
  addProduct: async (req, res) => {
    const { name, category, type, strengthAndForm, price } = req.body;

    // Validate inputs
    if (
      !name ||
      !category ||
      !type ||
      !strengthAndForm ||
      !price ||
      !validator.isFloat(price.toString())
    ) {
      return res.status(400).send({ ERR: "Invalid or missing fields" });
    }

    try {
      // Call module to add product to the Medicine table
      const response = await pharmacyModule.addProductToMedicineTable({
        name,
        category,
        type,
        strengthAndForm,
        price,
      });
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      logger.error({
        message: "Error occurred in pharmacyController : addProduct",
        error: err,
      });
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },

  // Add product to the Pharmacy table with stock value
  addProductToPharmacyWithStock: async (req, res) => {
    const { medicineID, clinicID, stock } = req.body;

    // Validate inputs
    if (
      !medicineID ||
      !clinicID ||
      !stock ||
      !validator.isInt(medicineID.toString()) ||
      !validator.isInt(clinicID.toString()) ||
      !validator.isInt(stock.toString())
    ) {
      return res.status(400).send({ ERR: "Invalid or missing fields" });
    }

    try {
      // Call module to add product to Pharmacy with stock value
      const response = await pharmacyModule.addProductToPharmacy({
        medicineID,
        clinicID,
        stock,
      });
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      logger.error({
        message:
          "Error occurred in pharmacyController : addProductToPharmacyWithStock",
        error: err,
      });
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },

  // Edit an existing product's details
  editProduct: async (req, res) => {
    const { productID, name, category, type, strengthAndForm } = req.body;

    // Validate productID and optional fields
    if (!productID || !validator.isInt(productID.toString())) {
      return res.status(400).send({ ERR: "Invalid or missing productID" });
    }

    try {
      const response = await pharmacyModule.editProduct({
        productID,
        name,
        category,
        type,
        strengthAndForm,
      });
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      logger.error({
        message: "Error occurred in pharmacyController : editProduct",
        error: err,
      });
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },

  // Update stock of a specific product
  updateStock: async (req, res) => {
    const { productID, clinicID, stock } = req.body;

    // Validate inputs
    if (
      !productID ||
      !validator.isInt(productID.toString()) ||
      !clinicID ||
      !validator.isInt(clinicID.toString()) ||
      !validator.isInt(stock.toString())
    ) {
      return res
        .status(400)
        .send({ ERR: "Invalid or missing productID or stock" });
    }

    try {
      const response = await pharmacyModule.updateStock(
        productID,
        clinicID,
        stock
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      logger.error({
        message: "Error occurred in pharmacyController : updateStock",
        error: err,
      });
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },

  // Delete a product from a pharmacy
  deleteProductInPharmacy: async (req, res) => {
    const { productID, clinicID } = req.params;

    // Validate inputs
    if (
      !productID ||
      !clinicID ||
      !validator.isInt(productID.toString()) ||
      !validator.isInt(clinicID.toString())
    ) {
      return res
        .status(400)
        .send({ ERR: "Invalid or missing productID or clinicID" });
    }

    try {
      const response = await pharmacyModule.deleteProductInPharmacy(
        productID,
        clinicID
      );
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      logger.error({
        message:
          "Error occurred in pharmacyController : deleteProductInPharmacy",
        error: err,
      });
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },

  // Delete a product entirely
  deleteProduct: async (req, res) => {
    const { productID } = req.params;

    // Validate productID
    if (!productID || !validator.isInt(productID.toString())) {
      return res.status(400).send({ ERR: "Invalid or missing productID" });
    }

    try {
      const response = await pharmacyModule.deleteProduct(productID);
      return res.status(response.responseStatus).send(response.responseBody);
    } catch (err) {
      logger.error({
        message: "Error occurred in pharmacyController : deleteProduct",
        error: err,
      });
      return res.status(500).send({ ERR: "Internal Server Error" });
    }
  },
};

module.exports = pharmacyController;
