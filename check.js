const loedata = require('./csvjsonloe.json');
const data = require('./compl.json');

const fs = require('node:fs');

const cats = [];

let x = 0;
data.forEach((i, index) => {
    const c = loedata.filter(l => {

        if (!cats.includes(i.type)) {
            cats.push(i.type);
        }

        // console.log(typeof l.title, l.title);
        
        return String(l.title).trim() === i.title.trim() && l.sig === i.signatur && String(l.barcode) === String(i.bc);
        
    });

    if (c.length !== 1) {
        x = x + 1;
        console.log(c.length, 'Possible BCs for', i);
        const c2 = loedata.filter(l => {
            return String(l.title).trim() === i.title.trim() && l.sig === i.signatur;
        });

        c2.forEach(i => console.log(i.barcode));

        if (c2.length === 1) {
           data[index] = {
                ...i,
                bc: String(c2[0].barcode),
            };

            fs.writeFileSync('./compl.json', JSON.stringify(data, null, 10));
        }

       

        console.log('---');

    }
});


loedata.forEach(a => {
    const m = data.filter(b => b.bc === String(a.barcode));

    if (m.length !== 1) {
        console.log(m, a);
    }
});

console.log(cats);