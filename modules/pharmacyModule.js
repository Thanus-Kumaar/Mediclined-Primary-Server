const {
  setResponseAsError,
  setResponseAsOk,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");
const DBTransactionQuery = require("../database/helper/DBTransaction.js");

const pharmacyModule = {
  getProductsInPharmacy: async function (clinicID) {
    try {
      const products = await DBSingleQuery(
        "Medicine, Pharmacy, Clinic",
        "READ",
        "SELECT m.Medicine_ID, m.Name, m.Category, m.Type, m.Strength_and_Form, m.Price FROM Medicine AS m JOIN Pharmacy AS p ON m.Medicine_ID = p.Medicine_ID JOIN Clinic AS c ON c.Clinic_ID = p.Clinic_ID WHERE c.Clinic_ID = ?",
        [clinicID]
      );
      console.log(products);
      if (products != "FAILURE") {
        return setResponseAsOk(products);
      } else {
        return setResponseAsError("Failed to retrive products of the clinic!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in getProductsInPharmacy: " + err.message
      );
    }
  },
  getProduct: async function (productID) {
    try {
      const product = await DBSingleQuery(
        "Medicine",
        "READ",
        "SELECT * FROM Medicine WHERE Medicine_ID = ?",
        [productID]
      );
      if (product !== "FAILURE") {
        return setResponseAsOk(product);
      } else {
        return setResponseAsError("Failed to retrieve the product!");
      }
    } catch (err) {
      return setResponseAsError("Error in getProduct: " + err.message);
    }
  },
  addProduct: async function (name, category, type, strengthAndForm, price) {
    try {
      const result = await DBSingleQuery(
        "Medicine",
        "WRITE",
        "INSERT INTO Medicine (Name, Category, Type, Strength_and_Form, Price) VALUES (?, ?, ?, ?, ?)",
        [name, category, type, strengthAndForm, price]
      );
      if (result !== "FAILURE") {
        return setResponseAsOk("Product added successfully!");
      } else {
        return setResponseAsError("Failed to add the product!");
      }
    } catch (err) {
      return setResponseAsError("Error in addProduct: " + err.message);
    }
  },
  addProductToPharmacyWithStock: async function (medicineID, clinicID, stock) {
    try {
      const result = await DBSingleQuery(
        "Pharmacy",
        "WRITE",
        "INSERT INTO Pharmacy (Medicine_ID, Clinic_ID, Stock) VALUES (?, ?, ?)",
        [medicineID, clinicID, stock]
      );
      if (result !== "FAILURE") {
        return setResponseAsOk(
          "Product added to pharmacy with stock successfully!"
        );
      } else {
        return setResponseAsError("Failed to add product to pharmacy!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in addProductToPharmacyWithStock: " + err.message
      );
    }
  },
  editProduct: async function (
    productID,
    name,
    category,
    type,
    strengthAndForm
  ) {
    try {
      const result = await DBSingleQuery(
        "Medicine",
        "WRITE",
        "UPDATE Medicine SET Name = ?, Category = ?, Type = ?, Strength_and_Form = ? WHERE Medicine_ID = ?",
        [name, category, type, strengthAndForm, productID]
      );
      if (result !== "FAILURE") {
        return setResponseAsOk("Product details updated successfully!");
      } else {
        return setResponseAsError("Failed to update product details!");
      }
    } catch (err) {
      return setResponseAsError("Error in editProduct: " + err.message);
    }
  },
  updateStock: async function (productID, clinicID, stock) {
    try {
      const result = await DBSingleQuery(
        "Pharmacy",
        "WRITE",
        "UPDATE Pharmacy SET Stock = ? WHERE Medicine_ID = ? AND Clinic_ID = ?",
        [stock, productID, clinicID]
      );
      if (result !== "FAILURE") {
        return setResponseAsOk("Stock updated successfully!");
      } else {
        return setResponseAsError("Failed to update stock!");
      }
    } catch (err) {
      return setResponseAsError("Error in updateStock: " + err.message);
    }
  },
  deleteProductInPharmacy: async function (productID, clinicID) {
    try {
      const result = await DBSingleQuery(
        "Pharmacy",
        "WRITE",
        "DELETE FROM Pharmacy WHERE Medicine_ID = ? AND Clinic_ID = ?",
        [productID, clinicID]
      );
      if (result !== "FAILURE") {
        return setResponseAsOk("Product deleted from pharmacy successfully!");
      } else {
        return setResponseAsError("Failed to delete product from pharmacy!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in deleteProductInPharmacy: " + err.message
      );
    }
  },
  deleteProduct: async function (productID) {
    try {
      const result = await DBTransactionQuery("Medicine", "WRITE", [
        {
          queryString: "DELETE FROM Pharmacy WHERE Medicine_ID = ?",
          queryParams: [productID],
        },
        {
          queryString: "DELETE FROM Medicine WHERE Medicine_ID = ?",
          queryParams: [productID],
        },
      ]);
      if (result !== "FAILURE") {
        return setResponseAsOk("Product deleted successfully!");
      } else {
        return setResponseAsError("Failed to delete product!");
      }
    } catch (err) {
      return setResponseAsError("Error in deleteProduct: " + err.message);
    }
  },
};

module.exports = pharmacyModule;
