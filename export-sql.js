const sql = require("msnodesqlv8");
const fs = require('fs');

const db = 'PSBIBLIO_BEISPIELDATENBANK';
const connectionString = `server=(localdb)\\psbiblio;Database=${db};Driver={ODBC Driver 17 for SQL Server}`;
const query = "SELECT * FROM MEDIEN WHERE MNUMMER LIKE 'RB%'";


const data = [];

async function doo() {
  

  const d = await runQuery();

  d.forEach(a => {
    data.push(a);
  });

  fs.writeFileSync('./data-export.json', JSON.stringify(data, null, 10));
}

async function runQuery() {
  const query2 = `SELECT * FROM MEDIEN`;

  return new Promise((resolve, reject) => {
    sql.query(connectionString, query2, (err, rows) => {
      resolve(rows);
    });
  });
}

doo();
