const DBPool = require("../DBPool.js");
const logger = require("../../utils/logger.js");

const executeTransactionQuery = async (tables, lockType, queries = []) => {
  let connection;
  try {
    connection = await DBPool.getConnection();
    await connection.query("SET autocommit = 0");
    await connection.beginTransaction();

    if (tables != null && lockType != null) {
      const lockQuery = `LOCK TABLES ${
        Array.isArray(tables)
          ? tables.map((table) => `${table} ${lockType}`).join(", ")
          : `${tables} ${lockType}`
      }`;
      await connection.query(lockQuery);
    }

    let results = [];
    for (const queryObj of queries) {
      const { queryString, queryParams } = queryObj;
      const isSelectQuery = queryString
        .trim()
        .toUpperCase()
        .startsWith("SELECT");

      if (isSelectQuery) {
        const [queryResult] = await connection.query(queryString, queryParams);
        results.push(queryResult);
      } else {
        await connection.query(queryString, queryParams);
      }
    }

    await connection.commit();
    logger.info({ message: `Transaction executed successfully` });
    await connection.query("UNLOCK TABLES");
    return results.length ? results : "SUCCESS";
  } catch (err) {
    await connection.rollback();
    await connection.query("UNLOCK TABLES");
    logger.error({
      message: "Error occurred during the transaction!",
      error: err,
    });
    return "FAILURE";
  } finally {
    if (connection) {
      await connection.query("SET autocommit = 1");
      connection.release();
    }
  }
};

module.exports = executeTransactionQuery;
