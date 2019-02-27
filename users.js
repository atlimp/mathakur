const express = require('express');

const { check, validationResult } = require('express-validator/check');
const xss = require('xss');

const {
    catchErrors,
    createCSV
} = require('./util');
const db = require('./db');

const router = express.Router();

/**
 * Validate id# input check length and format
 * Validate name length, cannot be empty or greater than 64
 */
const validate = [
    check('kt').isLength({
        min: 10,
        max: 10
    }).withMessage('Kennitala er ekki að réttri lengd'),
    check('kt').matches(/[0-9]{10}/).withMessage('Kennitala er ekki á réttu formi'),
    check('nafn').isLength({ min: 1}).withMessage('Nafn má ekki vera tómt'),
    check('nafn').isLength({ max: 64 }).withMessage('Nafn má mest vera 64 stafir'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(i => i.msg);
            res.render('addUser', { errorMessages });
            return;
        }

        next();
    },
];

/**
 * Add user if not already exists
 * @param {*} req 
 * @param {*} res 
 */
async function postUsers(req, res) {
    const {
        kt,
        nafn
    } = req.body;
    const {
        rows: check
    } = await db('SELECT * FROM USERS WHERE kennitala=$1', [ xss(kt) ]);

    if (check.length !== 0) {
        res.render('submitUser');
    } else {
        // Insert user to db with id and name
        const {
            rows
        } = await db('INSERT INTO users VALUES($1, $2) RETURNING *;', [ xss(kt), xss(nafn) ]);
        const [user] = rows;
        res.render('submitUser', {
            user
        })
    }
}

function addUser(req, res) {
    res.render('addUser');
}

router.post('/users', validate, catchErrors(postUsers));
router.get('/users', addUser);

module.exports = router;