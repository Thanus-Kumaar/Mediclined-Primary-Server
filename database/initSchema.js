const fs = require("fs");
const executeTransactionQuery = require("./helper/DBTransaction.js");

const initSchema = async () => {
  try {
    const data = await fs.promises.readFile("./database/schema.sql", "utf8");

    const queries = data
      .split(";")
      .map((query) => query.trim())
      .filter(Boolean);
    const formattedQueries = queries.map((query) => ({
      queryString: query,
      queryParams: [],
      type: query.startsWith("SELECT") ? "Select" : "NoSelect",
    }));
    const result = await executeTransactionQuery(null,null, formattedQueries);
    if (result === "SUCCESS") {
      console.log("[LOG]: Schema Initialized Successfully.");
    } else {
      console.log("[LOG]: Schema Initialization Failed.");
    }
  } catch (err) {
    console.error("[ERR]:", err);
  }
};

module.exports = initSchema;
