const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nimapInfotech',
});

async function runQuery(query) {
    try {
      const [rows] = await db.promise().query(query); // Using promise-based query with mysql2
      return rows;
    } catch (error) {
      throw error; // Throw error for controller to catch
    }
}

module.exports = { runQuery };
