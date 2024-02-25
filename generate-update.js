const fs = require('fs');
const list = require("./compl.json");

const statements = [];

function escapeRegExp(text) {
  if (!text || typeof text !== 'string') return text;

  return text.replaceAll("'", "");
}

list.forEach(item => {
  statements.push(
    `UPDATE [dbo].[MEDIEN] SET SIG='${escapeRegExp(item.signatur)}', AUTOR='${escapeRegExp(item.author)}', TITEL='${escapeRegExp(item.title)}', UTITEL='${escapeRegExp(item.sub)}', ISBN='${escapeRegExp(item.isbn)}' WHERE MCODE='${item.bc}'`
  );
});

fs.writeFileSync('./data-export.sql', statements.join('\n'));
