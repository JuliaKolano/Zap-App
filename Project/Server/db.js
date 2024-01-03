//imports
const mysql = require("mysql2/promise");

//prepare the database credentials
const credentials = {
  host: "jk911.brighton.domains",
  user: "jk911_pangolins",
  password: "eC{Z-2CZh&eU",
  database: "jk911_pangolin_sightings",
};

async function query(sql, params) {
  let connection;
  try {
    //connect to the database
    connection = await mysql.createConnection(credentials);

    // check the database connection before performing any queries
    if (!connection) {
      throw new Error("Failed to successfully connect to the database");
    }

    const [results] = await connection.execute(sql, params);
    return results;
    // throw an error if not able to connect to the database
  } catch (error) {
    console.error("Database query error:", error.message);
    throw error;
    // close the database connection after executing the query
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  query,
};
