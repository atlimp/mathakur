const express = require('express');
const {
    catchErrors,
    createCSV
} = require('./util');
const db = require('./db');

const router = express.Router();

/*
async function getUsers(req, res) {
    const { rows } = await db('SELECT * FROM users;');
    return res.status(200).json(rows);
}

*/

async function postUsers(req, res) {
    const {
        kt,
        nafn
    } = req.body;
    const {
        rows: check
    } = await db('SELECT * FROM USERS WHERE kennitala=$1', [kt]);



    if (check.length !== 0) {
        res.render('submitUser');
    } else {
        const {
            rows
        } = await db('INSERT INTO users VALUES($1, $2) RETURNING *;', [kt, nafn]);
        const [user] = rows;
        res.render('submitUser', {
            user
        })
    }
}

async function postFood(req, res) {
    const {
        kt
    } = req.body;

    const {
        rows: check
    } = await db('SELECT * FROM matur WHERE dagur=CURRENT_DATE AND kennitala=$1', [kt]);

    if (check.length !== 0) {
        res.render('submitFood');
    } else {
        const {
            rows
        } = await db('INSERT INTO matur VALUES($1, CURRENT_DATE, true) RETURNING *;', [kt]);

        const [user] = rows;
        const {
            kennitala
        } = user;
        res.render('submitFood', {
            kennitala
        });
    }
}

async function getFood(req, res) {
    const {
        startDate,
        endDate,
    } = req.query;

    const data = await getFoodBetweenDate(startDate, endDate);
    
    res.render('food', {
        data
    });
}

function addFood(req, res) {
    res.render('addFood');
}

function addUser(req, res) {
    res.render('addUser');
}

async function download(req, res) {
    const {
        startDate,
        endDate,
    } = req.query;

    const data = await getFoodBetweenDate(startDate, endDate);

    const csv = createCSV('dagur;kennitala;nafn', data, '\n');
    res.set('Content-Disposition', 'attachment; filename="gogn.csv"');

    res.send(csv);
}

async function getFoodBetweenDate(startDate, endDate) {
    if (startDate) {

        if (endDate) {
            const {
                rows,
            } = await db('SELECT m.dagur, u.kennitala, u.nafn FROM users u JOIN matur m ON u.kennitala=m.kennitala WHERE m.dagur BETWEEN $1 AND $2;', [ startDate, endDate ]);
            
            data = rows.map(el => {
                const date = new Date(el.dagur);
                const dagur = date.toISOString().replace(/T.*/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1');
                return { dagur, kennitala: el.kennitala, nafn: el.nafn };
            });
    
            return data;
        }

        const {
            rows,
        } = await db('SELECT m.dagur, u.kennitala, u.nafn FROM users u JOIN matur m ON u.kennitala=m.kennitala WHERE m.dagur = $1;', [ startDate ]);
        
        data = rows.map(el => {
            const date = new Date(el.dagur);
            const dagur = date.toISOString().replace(/T.*/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1');
            return { dagur, kennitala: el.kennitala, nafn: el.nafn };
        });

        return data;
    
    } else {
        const {
            rows,
        } = await db('SELECT m.dagur, u.kennitala, u.nafn FROM users u JOIN matur m ON u.kennitala=m.kennitala WHERE m.dagur = CURRENT_DATE;');
        
        data = rows.map(el => {
            const date = new Date(el.dagur);
            const dagur = date.toISOString().replace(/T.*/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1');
            return { dagur, kennitala: el.kennitala, nafn: el.nafn };
        });

        return data;
    }
}

//router.get('/users', catchErrors(getUsers));
router.post('/users', catchErrors(postUsers));
router.get('/food', catchErrors(getFood));
router.post('/food', catchErrors(postFood));
router.get('/', addFood);
router.get('/users', addUser);
router.get('/download', download);


module.exports = router;