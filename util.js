const db = require('./db');

function catchErrors(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
}

/**
 * 
 * @param {Optional header in csv} header 
 * @param {Array of objects for values} values 
 * @param {New line string} lf 
 */
function createCSV(header = '', values, lf) {
    return values.reduce((k, u) => {
        return `${k}${u.day};${u.idno};${u.name}${lf}`
    }, `${header}${lf}`);
}

/**
 * Get all submissions within given dates
 * @param {*} startDate 
 * @param {*} endDate 
 */
async function getFoodBetweenDate(startDate, endDate) {
    if (startDate) {

        if (endDate) {
            const {
                rows,
            } = await db('SELECT su.day, st.idNO, st.name FROM staff st JOIN submission su ON st.idNO = su.idNO WHERE su.day BETWEEN $1 AND $2;', [ startDate, endDate ]);
            
            data = rows.map(el => {
                const date = new Date(el.day);
                const day = date.toISOString().replace(/T.*/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1');
                return { day, idno: el.idno, name: el.name };
            });
    
            return data;
        }

        const {
            rows,
        } = await db('SELECT su.day, st.idNO, st.name FROM staff st JOIN submission su ON st.idNO = su.idNO WHERE su.day = $1;', [ startDate ]);
        
        data = rows.map(el => {
            const date = new Date(el.day);
            const day = date.toISOString().replace(/T.*/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1');
            return { day, idno: el.idno, name: el.name };
        });

        return data;
    
    } else {
        const {
            rows,
        } = await db('SELECT su.day, st.idNO, st.name FROM staff st JOIN submission su ON st.idNO = su.idNO WHERE su.day = CURRENT_DATE;');
        
        data = rows.map(el => {
            const date = new Date(el.day);
            const day = date.toISOString().replace(/T.*/, '').replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1');
            return { day, idno: el.idno, name: el.name };
        });

        return data;
    }
}
  
module.exports = {
    catchErrors,
    createCSV,
    getFoodBetweenDate,
};
  