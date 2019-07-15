[![Build Status](https://travis-ci.com/cavepotcode/zanahorario.svg?branch=master)](https://travis-ci.com/cavepotcode/zanahorario)

# zanahorario
Timetracker

## Getting started
* Install the dependencies
```bash
npm install
```

* Create a new file called `.env` in the server folder, with the contents of `.env.example`. Setup the database credentials in the DATABASE_URL variable.

* Create a database in postgres called `zanahorario`.

* Build the project:
```bash
cd server
npx kc build
```

* Run the migrations to create the database schema:
```bash
npx typeorm migration:run
```

* Optionally, execute this SQL script `./server/src/seed.sql` to populate some data.

Executing script using bash:
```bash
psql postgres -f ./server/src/seed.sql --dbname=zanahorario
```

The seed data includes several users (all with password `Password.01`) and projects to start with.


* Run dev server
```bash
npm run dev
```
This command will start kiwi-server (port 8086) in watch mode (automatically detecting and compiling any changes in the server source code), and start the client-side server (port 3000)
