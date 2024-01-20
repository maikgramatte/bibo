const list = require("./list.json");
const axios = require("axios");
const jsdom = require("jsdom");
const fs = require('node:fs');
const { JSDOM } = jsdom;

function wait (timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, timeout);
    });
  }


let compl = require("./compl.json");

const perc = (compl.length / list.length) * 100;

console.log(`${perc}% --- ${compl.length} von ${list.length} done`);

const jsonData = [];

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }


const batchCount = 1000;

function doo() {
    let xc = 0;
    asyncForEach(list, async (i) => {
        const match = compl.find(a => a.url === i.url && a.check !== 'manually-3');

        if (!match && xc < batchCount) {
            console.log(`- ${xc} from ${batchCount} -`);
            await parsePage(i);
            
            
            await wait(1000);

            xc++;
        }
    });
}

function parseData(item, page) {
    const dom = new JSDOM(page);

    const isbnEl = dom.window.document.querySelector('.isbn');
    const isbn = isbnEl ? isbnEl.textContent.replace('ISBN: ', '') : '';
    let x = 0;
    let lc = [];

    dom.window.document.querySelectorAll('.location').forEach(i => {
        const bibo = i.querySelector('span').textContent.trim();
        const bis = i.parentElement.querySelector('.date_due').textContent;

        if (bibo.includes(item.bibo)) {
            lc.push({
                bis,
                bc: i.parentElement.querySelector('.barcode').textContent.trim(),
            });                
        } else {
            console.log('Can not find', item.bibo, 'vs', bibo, bis);
        }
    });

    const singleBc = lc.filter(a => a.bis === '01.06.2024' || a.bis === '03.06.2024' || a.bis === '02.06.2024' || a.bis === '05.06.2024' || a.bis == "08.06.2024");

    const ret = {
        isbn,
        check: '',
    }
    
    if (lc.length === 1) {
        ret.bc = lc[0].bc;
    } else if (singleBc.length === 1) {
        ret.bc = singleBc[0].bc;
        ret.check = 'BC picked by Due date';
    } else {
        ret.bc = null;
        ret.check = 'manually-4';


        const sndCheck = [];
        dom.window.document.querySelectorAll('.location').forEach(i => {
            const bibo = i.querySelector('span').textContent.trim();
            const bis = i.parentElement.querySelector('.date_due').textContent;

            if ((bibo.includes('Kreisergänzungsbibliothek') || bibo.includes('Fahrbibliothek')) && ['01.06.2024', '02.06.2024', '03.06.2024', '05.06.2024', "08.06.2024"].includes(bis)) {
                sndCheck.push(i.parentElement.querySelector('.barcode').textContent.trim());
            }
        });

        if (sndCheck.length === 1) {
            ret.bc = sndCheck[0];
            ret.check = 'KEB-missmatch';
        }
    }

    return ret;
}


async function parsePage(item) {
    const res = await axios.get(item.url);
    console.log('Go for', item.url);

    const rd = parseData(item, res.data);

    const index = compl.findIndex(a => a.url === item.url);

    if (index !== -1) {
        console.log(' - Replace -', index);
        compl[index] = {
            ...item,
            ...rd,
        }
    } else {
        compl.push({
            ...item,
           ...rd,
        });
    }

    console.log(rd);

    fs.writeFileSync('./compl.json', JSON.stringify(compl, null, 10));
}

doo();
