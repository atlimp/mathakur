function catchErrors(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
}

function createCSV(header = '', values, lf) {
    return values.reduce((k, u) => {
        return `${k}${u.kennitala};${u.nafn};${u.imat ? 'Já' : 'Nei'}${lf}`
    }, `${header}${lf}`);
}
  
module.exports = {
    catchErrors,
    createCSV,
};
  