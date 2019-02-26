const express = require('express');
const {
    catchErrors,
    createCSV
} = require('./util');
const db = require('./db');

const router = express.Router();

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

function addUser(req, res) {
    res.render('addUser');
}

router.post('/users', catchErrors(postUsers));
router.get('/users', addUser);

module.exports = router;