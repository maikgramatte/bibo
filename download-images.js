const axios = require("axios");
const jsdom = require("jsdom");
let compl = require("./compl.json");
const fs = require('node:fs');

const { JSDOM } = jsdom;

function wait (timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve()
        }, timeout);
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const batchCount = 3000;

async function parsePage(item) {
    if (item.isbn) {
        const b = item.isbn.split(';')[0].trim();
        
        try {
            const response = await axios({
                method: "get",
                // url: `https://cover.ekz.de/${b}.jpg`,
                url: `https://pictures.abebooks.com/isbn/${b}.jpg`,
                responseType: "stream",
            });
            console.log(item);
            await response.data.pipe(fs.createWriteStream(`./images/${item.bc}.jpg`));
            return `${item.bc}.jpg`;
        } catch (error) {
            return 'error-2';
        }
    } else {
        return 'none';
    }
}

function doo() {
    let xc = 0;
    
    asyncForEach(compl, async (i) => {
        let check = !['none', 'error-2'].includes(i.img);

        if (!['error', 'none', 'error-2'].includes(i.img) && i.img !== undefined) {
            var stats = fs.statSync(`./images/${i.img}`);
            
            if (stats.size !== 9977) {
                check = false;
            } else {
                console.log('Dummy image');
            }
        }

        if (check && xc < batchCount) {
            console.log(`- ${xc} from ${batchCount} -`);
            const st = await parsePage(i);

            const index = compl.findIndex(a => a.url === i.url);
            console.log(index, st, i.isbn);
            compl[index] = {
                ...compl[index],
                img: st,
            };
            fs.writeFileSync('./compl.json', JSON.stringify(compl, null, 10));
            
            await wait(300);

            xc++;
        }
    });
}


doo();