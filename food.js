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
    check('id_no').isLength({
        min: 10,
        max: 10
    }).withMessage('Kennitala er ekki að réttri lengd'),
    check('id_no').matches(/[0-9]{10}/).withMessage('Kennitala er ekki á réttu formi'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(i => i.msg);
            res.render('submission', { errorMessages });
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
            res.render('table', { errorMessages });
            return;
        }

        next();
    },
]

/**
 * Food submission page
 */
function addFood(req, res) {
    res.render('submission');
}


/**
 * Add submission for food, checks if already submitted
 * @param {*} req 
 * @param {*} res 
 */
async function postFood(req, res) {
    const {
        id_no
    } = req.body;

    // Check if user has already submitted
    const {
        rows: check
    } = await db('SELECT * FROM submission WHERE day=CURRENT_DATE AND id_no=$1', [ xss(id_no) ]);
    
    if (check.length !== 0) {
        res.render('submissionRecorded');
    } else {
        // Submit food for given id#
        const {
            rows
        } = await db('INSERT INTO submission VALUES($1, CURRENT_DATE) RETURNING *;', [ xss(id_no) ]);

        const [ user ] = rows;

        console.log('Submission from: ', user);

        const {
            id_no: submitted
        } = user;

        res.render('submissionRecorded', {
            id_no: submitted,
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

    res.render('table', {
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