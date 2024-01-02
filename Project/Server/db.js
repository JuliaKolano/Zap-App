//imports
const mysql = require('mysql2/promise');

//connect to the database
const credentials = {
    host: 'jk911.brighton.domains',
    user: 'jk911_pangolins',
    password: 'eC{Z-2CZh&eU',
    database: 'jk911_pangolin_sightings'
};

async function query(sql, params) {
    const connection = await mysql.createConnection(credentials);
    try {
        const [results, ] = await connection.execute(sql, params);
        return results;
    // close the database connection after executing the query
    } finally {
        await connection.end();
    }
}

module.exports = {
    query
}