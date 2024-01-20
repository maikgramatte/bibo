const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const fs = require('node:fs');

try {
    const data = fs.readFileSync('/Katalog.html', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
  
// const dom = new JSDOM(response.data);
//     [...dom.window.document.querySelectorAll('.card-title a')].forEach(el => console.log(`- ${el.textContent}`));

