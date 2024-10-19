const DBPool = require("../DBPool.js");
const logger = require("../../utils/logger.js");

const executeTransactionQuery = async (tables, lockType, queries = []) => {
  let connection;
  try {
    connection = await DBPool.getConnection();
    await connection.beginTransaction();

    if (tables != null && lockType!=null) {
      const lockQuery = `LOCK TABLES ${
        Array.isArray(tables)
          ? tables.map((table) => `${table} ${lockType}`).join(", ")
          : `${tables} ${lockType}`
      }`;
      await connection.query(lockQuery);
    }
    let results = [];
    for (const queryObj of queries) {
      const { queryString, queryParams, type } = queryObj;
      if (type === "Select") {
        const [queryResult] = await connection.query(queryString, queryParams);
        results.push(queryResult);
      } else if (type === "NoSelect") {
        await connection.query(queryString, queryParams);
      }
    }
    await connection.commit();
    logger.info({ message: `Transaction executed successfully` });
    await connection.query("UNLOCK TABLES");
    return results.length ? results : "SUCCESS";
  } catch (err) {
    await connection.rollback();
    logger.error({
      message: "Error occurred during the transaction!",
      error: err,
    });
    return "FAILURE";
  } finally {
    connection.release();
  }
};

module.exports = executeTransactionQuery;