const db = require('./db');

async function main() {
    await db('DROP TABLE IF EXISTS submission');
    console.log('DROP TABLE IF EXISTS submission');
    
    await db('DROP TABLE IF EXISTS staff');
    console.log('DROP TABLE IF EXISTS staff');
    
    await db('CREATE TABLE staff(id_no char(10) PRIMARY KEY, name varchar(64))');
    console.log('CREATE TABLE staff(id_no char(10) PRIMARY KEY, name varchar(64))');
    
    await db('CREATE TABLE submission(id_no char(10), day date, PRIMARY KEY (id_no, day), FOREIGN KEY (id_no) REFERENCES staff(id_no))');
    console.log('CREATE TABLE submission(id_no char(10), day date, PRIMARY KEY (id_no, day), FOREIGN KEY (id_no) REFERENCES staff(id_no))'); 
}

main();