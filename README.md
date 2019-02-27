# Mathákur
Lunch submission system that can be generalized for other uses.  Written with nodejs.

## Setting up
* Clone the repository
* Install the dependencies by running
```
$ npm install
```
You need to use postgres as a database manager.  Create a database and write a .env in the projects root folder with the following parameters
```
DATABASE_URL=
HOST=
PORT=
```
Run the createDB.js before you start up the server.

## Starting the server
Simply run `$ npm start` and your server should be up and running.  Open up a browser and go to the HOST:PORT as previously defined in the .env.

## Built with
* [NodeJS](https://nodejs.org/en/)
* [Express](http://expressjs.com/) Web framework
* [pug](https://pugjs.org/api/getting-started.html) View engine

## Author
* Atli Marcher Pálsson [atlimp](https://github.com/atlimp)
