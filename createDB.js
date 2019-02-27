const db = require('./db');

async function main() {
    await db('DROP TABLE IF EXISTS submission');
    console.log('DROP TABLE IF EXISTS submission');
    
    await db('DROP TABLE IF EXISTS staff');
    console.log('DROP TABLE IF EXISTS staff');
    
    await db('CREATE TABLE staff(idNO char(10) PRIMARY KEY, name varchar(64))');
    console.log('CREATE TABLE staff(idNO char(10) PRIMARY KEY, name varchar(64))');
    
    await db('CREATE TABLE submission(idNO char(10), day date, PRIMARY KEY (idNO, day), FOREIGN KEY (idNO) REFERENCES staff(idNO))');
    console.log('CREATE TABLE submission(idNO char(10), day date, PRIMARY KEY (idNO, day), FOREIGN KEY (idNO) REFERENCES staff(idNO))'); 
}

main();