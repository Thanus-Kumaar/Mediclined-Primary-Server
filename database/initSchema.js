const fs = require("fs");

const initSchema = (DBPool) => {
  try {
    fs.readFile("./database/schema.sql", "utf8", (err, data) => {
      if (err) {
        console.log("[ERR]:", err);
      } else {
        DBPool.query(data, (err, result) => {
          if (err) {
            console.log("[ERR]:", err);
          } else {
            console.log(`[LOG]: Schema Initialized Successfully.`);
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = initSchema;