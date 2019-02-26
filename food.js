const express = require('express');
const {
    catchErrors,
    createCSV,
    getFoodBetweenDate,
} = require('./util');
const db = require('./db');

const {
    check,
    validationResult
} = require('express-validator/check');

const router = express.Router();

const validate = [
    check('kt').isLength({
        min: 10,
        max: 10
    }).withMessage('Kennitala er ekki að réttri lengd'),
    check('kt').matches(/[0-9]{10}/).withMessage('Kennitala er ekki á réttu formi'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(i => i.msg);
            res.render('addFood', { errorMessages });
            return;
        }

        next();
    },
];

function addFood(req, res) {
    res.render('addFood');
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


router.get('/food', catchErrors(getFood));
router.post('/food', validate, catchErrors(postFood));
router.get('/download', download);
router.get('/', addFood);

module.exports = router;