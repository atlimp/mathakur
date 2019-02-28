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
    check('id_no').isLength({
        min: 10,
        max: 10
    }).withMessage('Kennitala er ekki að réttri lengd'),
    check('id_no').matches(/[0-9]{10}/).withMessage('Kennitala er ekki á réttu formi'),
    check('name').isLength({ min: 1}).withMessage('name má ekki vera tómt'),
    check('name').isLength({ max: 64 }).withMessage('name má mest vera 64 stafir'),
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
        id_no,
        name
    } = req.body;
    const {
        rows: check
    } = await db('SELECT * FROM staff WHERE id_no=$1', [ xss(id_no) ]);

    if (check.length !== 0) {
        res.render('submitUser');
    } else {
        // Insert user to db with id and name
        const {
            rows
        } = await db('INSERT INTO staff VALUES($1, $2) RETURNING *', [ xss(id_no), xss(name) ]);
        const [ user ] = rows;
       
        console.log('User added', user);
        
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