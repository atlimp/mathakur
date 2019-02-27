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
        return `${k}${u.dagur};${u.kennitala};${u.nafn}${lf}`
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
  
module.exports = {
    catchErrors,
    createCSV,
    getFoodBetweenDate,
};
  