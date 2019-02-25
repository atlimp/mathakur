const express = require('express');
const { catchErrors, createCSV } = require('./util');
const db = require('./db');

const router = express.Router();

/*
async function getUsers(req, res) {
    const { rows } = await db('SELECT * FROM users;');
    return res.status(200).json(rows);
}

*/

async function postUsers(req, res) {
    const { kt, nafn } = req.body;
    const { rows: check } = await db('SELECT * FROM USERS WHERE kennitala=$1', [ kt ]);



    if (check.length !== 0) {
        res.render('submitUser');
    } else {
        const { rows } = await db('INSERT INTO users VALUES($1, $2) RETURNING *;', [ kt, nafn ]);
        const [ user ] = rows;
        res.render('submitUser', { user })
    }
}

async function postFood(req, res) {
    const { kt } = req.body;

    const { rows: check } = await db('SELECT * FROM matur WHERE dagur=CURRENT_DATE AND kennitala=$1', [ kt ]);

    if (check.length !== 0) {
        res.render('submitFood');
    } else {
        const { rows } = await db('INSERT INTO matur VALUES($1, CURRENT_DATE, true) RETURNING *;', [ kt ]);
    
        const [ user ] = rows;
        const { kennitala } = user;
        res.render('submitFood', { kennitala });
    }
}

async function getFood(req, res) {
    const { t } = req.query; 
    if (t) {
        const today = new Date(t);
        const { rows } = await db('SELECT u.kennitala, u.nafn, m.imat FROM users u, matur m WHERE u.kennitala=m.kennitala AND m.dagur=$1;', [ t ]);
        res.render('food', { rows });
    } else {
        const { rows } = await db('SELECT u.kennitala, u.nafn, m.imat FROM users u LEFT OUTER JOIN matur m ON u.kennitala=m.kennitala WHERE m.dagur=CURRENT_DATE OR m.dagur is NULL;');
        console.log(rows);
        res.render('food', { rows });
    }
}

function addFood(req, res) {
    res.render('addFood');
}

function addUser(req, res) {
    res.render('addUser');
}

async function download(req, res) {
    const { charset } = req.query;
    const { rows } = await db('SELECT u.kennitala, u.nafn, m.imat FROM users u LEFT OUTER JOIN matur m ON u.kennitala=m.kennitala WHERE m.dagur=CURRENT_DATE OR m.dagur is NULL;');
    const csv = createCSV('kennitala;nafn;imat', rows, '\n');    
    res.set('Content-Disposition', 'attachment; filename="gogn.csv"');
    res.send(csv);
}

//router.get('/users', catchErrors(getUsers));
router.post('/users', catchErrors(postUsers));
router.get('/food', catchErrors(getFood));
router.post('/food', catchErrors(postFood));
router.get('/', addFood);
router.get('/users', addUser);
router.get('/download', download);


module.exports = router;