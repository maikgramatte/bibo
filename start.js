const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const fs = require('node:fs');

try {
    const json = [];
    const data = fs.readFileSync('./Katalog.html');
    const dom = new JSDOM(data);

    const elem = dom.window.document.querySelectorAll('#checkoutst_wrapper tr');

    dom.window.document.querySelectorAll('.tdlabel').forEach(e => e.remove());

    elem.forEach(element => {
      const n = element.querySelector('td a.title');
      if (n) {
        const url = `https://mv-oberlausitz.lmscloud.net${n.getAttribute('href')}`;
        const title = element.querySelector('.biblio-title').textContent.trim();
        const sub = element.querySelector('.subtitle') ? element.querySelector('.subtitle').textContent.trim() : '';
        const bibo = element.querySelector('td.branch').textContent.trim();
        const signatur = element.querySelector('td.call_no').textContent.trim();
        const author = element.querySelector('td.author').textContent.trim();
        const type = element.querySelector('td.itype img').getAttribute('title');

        json.push({
          type,
          url,
          title,
          sub,
          bibo,
          signatur,
          author,
        });
      }
    });

    fs.writeFileSync('./list.json', JSON.stringify(json, null, 10));

  } catch (err) {
    console.error(err);
  }
  



//     [...dom.window.document.querySelectorAll('.card-title a')].forEach(el => console.log(`- ${el.textContent}`));

