const {
  setResponseAsError,
  setResponseAsOk,
} = require("../utils/standardResponse.js");
const DBSingleQuery = require("../database/helper/DBSingleQuery.js");
const DBTransactionQuery = require("../database/helper/DBTransaction.js");

const billModule = {
  getBillForStudent: async function (email) {
    try {
      const bills = await DBSingleQuery(
        ["Bill"],  
        "READ",
        `SELECT Bill_ID, Creation_date, Price, Quantity
         FROM Bill
         WHERE Patient_Email = ?`,
        [email]
      );
      if (bills != "FAILURE") {
        return setResponseAsOk(bills);
      } else {
        return setResponseAsError("Failed to retrive the bill for the given email!");
      }
    } catch (err) {
      return setResponseAsError("Error in getBillForStudent: " + err.message);
    }
  },
  getBill: async function(billID) {
    try {
      const bill = await DBSingleQuery(
        ["Bill", "\`Order\`", "BillContainsMedicine", "Medicine"],
        "READ",
        `SELECT b.Bill_ID, b.Creation_date, b.Price, b.Quantity, 
                o.Status, o.OTP, o.Completion_time, 
                m.Name as Medicine_Name, bcm.Quantity as Medicine_Quantity
         FROM Bill b
         JOIN \`Order\` o ON b.Bill_ID = o.Bill_ID
         JOIN BillContainsMedicine bcm ON b.Bill_ID = bcm.Bill_ID
         JOIN Medicine m ON bcm.Medicine_ID = m.Medicine_ID
         WHERE b.Bill_ID = ?`,
        [billID]
      );

      if (bill != "FAILURE") {
        return setResponseAsOk(bill);
      } else {
        return setResponseAsError("Failed to retrieve bill!");
      }
    } catch (err) {
      return setResponseAsError("Error in getBill: " + err.message);
    }
  },
  getBillsForPharmacy: async function(clinicID) {
    try {
      const bills = await DBSingleQuery(
        "Bill",
        "READ",
        `SELECT Bill_ID, Creation_date, Price, Quantity
         FROM Bill
         WHERE Clinic_ID = ?`,
        [clinicID]
      );

      if (bills != "FAILURE") {
        return setResponseAsOk(bills);
      } else {
        return setResponseAsError("Failed to retrieve bills for the pharmacy/clinic!");
      }
    } catch (err) {
      return setResponseAsError("Error in getBillsForPharmacy: " + err.message);
    }
  },
  createBill: async function(clinicID, price, quantity, medicines) {
    const queries = [
      {
        queryString: `INSERT INTO Bill (Clinic_ID, Price, Quantity, Creation_date) VALUES (?, ?, ?, NOW())`,
        queryParams: [clinicID, price, quantity],
      },
      ...medicines.map(medicine => ({
        queryString: `INSERT INTO BillContainsMedicine (Bill_ID, Medicine_ID, Quantity) VALUES (LAST_INSERT_ID(), ?, ?)`,
        queryParams: [medicine.medicineID, medicine.quantity],
      })),
      {
        queryString: `INSERT INTO \`Order\` (Bill_ID, Status, OTP, Completion_time) VALUES (LAST_INSERT_ID(), 'PENDING', ?, NULL)`,
        queryParams: [Math.floor(1000 + Math.random() * 9000)],
      }
    ];

    try {
      const result = await DBTransactionQuery(["Bill", "BillContainsMedicine", "`Order`"], "WRITE", queries);
      return result === "SUCCESS"
        ? setResponseAsOk("Bill created successfully!")
        : setResponseAsError("Failed to create the bill!");
    } catch (err) {
      return setResponseAsError("Error in createBill: " + err.message);
    }
  },
  deleteBill: async function(billID) {
    try {
      const order = await DBSingleQuery(
        "`Order`",
        "READ",
        `SELECT Status FROM \`Order\` WHERE Bill_ID = ?`,
        [billID]
      );

      if (order != "FAILURE" && order && order[0].Status !== "OUT") {
        const deleteBill = await DBSingleQuery(
          "Bill",
          "WRITE",
          `DELETE FROM Bill WHERE Bill_ID = ?`,
          [billID]
        );

        if (deleteBill !== "FAILURE") {
          return setResponseAsOk("Bill deleted successfully!");
        } else {
          return setResponseAsError("Failed to delete the bill!");
        }
      } else {
        return setResponseAsError("Bill cannot be deleted as the order OUT FOR DELIVERY.");
      }
    } catch (err) {
      return setResponseAsError("Error in deleteBill: " + err.message);
    }
  },
  updateOrderStatus: async function({ billID, status }) {
    try {
      const updateResult = await DBSingleQuery(
        "`Order`",
        "WRITE",
        `UPDATE \`Order\` SET Status = ? WHERE Bill_ID = ?`,
        [status, billID]
      );

      if (updateResult != "FAILURE") {
        return setResponseAsOk("Order status updated successfully!");
      } else {
        return setResponseAsError("Failed to update order status!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in updateOrderStatus: " + err.message
      );
    }
  },
  deleteBillAndOrder: async function(billID) {
    try {
      const queries = [
        {
          queryString: `DELETE FROM \`Order\` WHERE Bill_ID = ?`,
          queryParams: [billID],
        },
        {
          queryString: `DELETE FROM Bill WHERE Bill_ID = ?`,
          queryParams: [billID],
        }
      ];

      const result = await DBTransactionQuery(["\'Order\`","Bill"], "WRITE", queries);

      if (result != "FAILURE") {
        return setResponseAsOk("Bill and order deleted successfully!");
      } else {
        return setResponseAsError("Failed to delete the bill and order!");
      }
    } catch (err) {
      return setResponseAsError(
        "Error in deleteBillAndOrder: " + err.message
      );
    }
  }
};

module.exports = billModule;
