function catchErrors(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
}

function createCSV(values) {
    return values.reduce((k, u) => {
        return `${k}${u.kennitala};${u.nafn};${u.imat ? 'Já' : 'Nei'}\n`
    }, '');
}
  
module.exports = {
    catchErrors,
    createCSV,
};
  