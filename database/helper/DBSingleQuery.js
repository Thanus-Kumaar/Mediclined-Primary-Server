const DBPool = require("../DBPool.js");
const logger = require("../../utils/logger.js");

const executeQuery = async (
  tables,
  lockType,
  queryString,
  queryParams = [],
) => {
  let connection;
  try {
    connection = await DBPool.getConnection();
    const lockQuery = `LOCK TABLES ${
      Array.isArray(tables)
        ? tables.map((table) => `${table} ${lockType}`).join(", ")
        : `${tables} ${lockType}`
    }`;

    await connection.query(lockQuery);

    const isSelectQuery = queryString.trim().toUpperCase().startsWith("SELECT");

    let results;
    if (isSelectQuery) {
      [results] = await connection.query(queryString, queryParams);
    } else{
      await connection.query(queryString, queryParams);
    }
    logger.info({ message: `Successful execution of query ${queryString}` });
    await connection.query("UNLOCK TABLES");
    return results?results:"SUCCESS";
  } catch (err) {
    logger.error({
      message: "Error occurred while running SQL query!",
      error: err,
    });
    return "FAILURE";
  } finally{
    connection.release();
  }
};

module.exports = executeQuery;
