const sql = require("msnodesqlv8");
const fs = require('fs');

const db = 'PSBIBLIO_BEISPIELDATENBANK';
const connectionString = `server=(localdb)\\psbiblio;Database=${db};Driver={ODBC Driver 17 for SQL Server}`;
const query = "SELECT * FROM MEDIEN WHERE MNUMMER LIKE 'RB%'";

// sql.query(connectionString, query, (err, rows) => {
//     console.log(err, rows);
// });


const data = require('./compl.json');

const keb_id = 1;

function wait (timeout) {
  return new Promise((resolve) => {
      setTimeout(() => {
      resolve()
      }, timeout);
  });
}

function getMcode(type) {
  if (type === 'Compact-Disc') {
    return 19;
  }

  if (type === 'CD-ROM') {
    return 19;
  }

  if (type === 'DVD') {
    return 17;
  }
  
  if (type === 'Spiele') {
    return 10;
  }

  if (type === 'Karte') {
    return 11;
  }

  if (type === 'Blu-Ray-Disc') {
    return 17;
  }

  // Buch
  return 1;
}

function getGRUPPE1(type) {
  if (type === 'Compact-Disc') {
    return 40;
  }

  if (type === 'DVD') {
    return 60;
  }
  
  if (type === 'Sachliteratur') {
    return 12;
  }

  if (type === 'Kinderlit. Bell.') {
    return 14;
  }

  if (type === 'Kinderlit. Sach.') {
    return 14;
  }
  
  if (type === 'Spiele') {
    return 70;
  }

  if (type === 'Karte') {
    return 90;
  }

  if (type === 'Medienkombination') {
    return 90;
  }

  if (type === 'CD-ROM') {
    return 40;
  }

  if (type === 'Blu-Ray-Disc') {
    return 40;
  }


//   12	Sachliteratur	1
// 13	Schöne Literatur	2
// 14	Kinder- und Jugendliteratur	3
// 20	Noten	4
// 30	Mikromaterialien	5
// 40	Tonträger	6
// 50	Dias und Arbeitstransparente	7
// 60	Filme und Videomaterialien	8
// 70	Spiele	9
// 90	Sonstige Materialien	10
  
 
  // Belletristik.
  return 13;
}

function escapeRegExp(text) {
  if (!text || typeof text !== 'string') return text;

  return text.replaceAll("'", "");
}

function doo() {
  let vv = 0;
    
  asyncForEach(data, async (i) => {
    vv = vv + 1;

    if (i.bc) {
      const b = i.isbn.split(';')[0].trim();

      const fileds = {
        GEAE_AM: '2024-01-14 00:00:01',
        ZUDATUM: '2024-01-14 00:00:01',
        LDATUM: '2024-01-14 00:00:01',
        GEAE_DURCH: 'system',
      
        MNUMMER: i.bc,
        SIG: i.signatur,
        AUTOR: i.author,
        TITEL: i.title,
        UTITEL: i.sub,
        ISBN13: b,
        ISBN: b,
        LIEFERANT: keb_id,
        GRUPPE1: getGRUPPE1(i.type),
        MCODE: getMcode(i.type),
        BEMERKUNG: (
          `Initialer import von ${i.url}`
        ),
      };
  
      await runQuery(fileds, vv);
      await wait(10);
    }
  });
}


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
  }
}

async function runQuery(fileds, vv) {
  const query2 = `INSERT INTO MEDIEN (${Object.keys(fileds).join(', ')}) VALUES ('${Object.keys(fileds).map(i => fileds[i]).map(escapeRegExp).join("', '")}')`;

  return new Promise((resolve, reject) => {
    sql.query(connectionString, query2, (err, rows) => {
      // console.log('INSERT', fileds);

      if (err && !String(err).includes('PRIMARY KEY constraint')) {
        console.log(vv, query2);
        console.log(err);
      }

      resolve();
    });
  });
}

doo();
