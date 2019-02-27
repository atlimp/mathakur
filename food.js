const express = require('express');

const { check, validationResult } = require('express-validator/check');
const xss = require('xss');


const {
    catchErrors,
    createCSV,
    getFoodBetweenDate,
} = require('./util');
const db = require('./db');

const router = express.Router();

/**
 * Validate id# input check length and format
 * 
 */
const validatePostFood = [
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

const validateDownload = [
    check('startDate').optional().isISO8601().withMessage('Dagsetning frá er ekki á réttu formi, á að vera YYYY-MM-DD'),
    check('endDate').optional().isISO8601().withMessage('Dagsetning til er ekki á réttu formi, á að vera YYYY-MM-DD'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(i => i.msg);
            res.render('food', { errorMessages });
            return;
        }

        next();
    },
]

/**
 * Food submission page
 */
function addFood(req, res) {
    res.render('addFood');
}


/**
 * Add submission for food, checks if already submitted
 * @param {*} req 
 * @param {*} res 
 */
async function postFood(req, res) {
    const {
        kt
    } = req.body;

    // Check if user has already submitted
    const {
        rows: check
    } = await db('SELECT * FROM matur WHERE dagur=CURRENT_DATE AND kennitala=$1', [ xss(kt) ]);

    if (check.length !== 0) {
        res.render('submitFood');
    } else {
        // Submit food for given id#
        const {
            rows
        } = await db('INSERT INTO matur VALUES($1, CURRENT_DATE, true) RETURNING *;', [ xss(kt) ]);

        const [ user ] = rows;
        const {
            kennitala
        } = user;

        res.render('submitFood', {
            kennitala
        });
    }
}

/**
 * Get food submissions with given dates, renders table
 * @param {*} req 
 * @param {*} res 
 */
async function getFood(req, res) {
    const {
        startDate,
        endDate,
    } = req.query;

    const data = await getFoodBetweenDate(xss(startDate), xss(endDate));

    res.render('food', {
        data
    });
}

/**
 * Generates CSV for submissions with given dates, downloadable
 * @param {*} req 
 * @param {*} res 
 */
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


router.get('/food', validateDownload, catchErrors(getFood));
router.post('/food', validatePostFood, catchErrors(postFood));
router.get('/download', validateDownload, download);
router.get('/', addFood);

module.exports = router;