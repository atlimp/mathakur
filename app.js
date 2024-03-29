const path = require('path');
const express = require('express');

const food = require('./food');
const users = require('./users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('charset', 'utf-8')
  next();
});

app.use('/', food);
app.use('/', users);

const {
  PORT: port,
  HOST: host,
} = process.env;

function notFoundHandler(req, res, next) {
  res.status(404).render('error', { title: '404', msg: 'Síða finnst ekki' });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).render('error', { title: 'Villa', msg: 'Eitthvað fór úrskeiðis' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {`Server running on ${host}:${port}`});