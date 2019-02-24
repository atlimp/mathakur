const { Client } = require('pg');
require('dotenv').config();

const {
    DATABASE_URL: connectionString = 'postgres://postgres:postgres@localhost/matradur',
} = process.env;

async function queryDB(query, values) {
    const client = new Client({ connectionString });
    await client.connect();

    try {
        const result = await client.query(query, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await client.end();
    }
}

module.exports = queryDB;