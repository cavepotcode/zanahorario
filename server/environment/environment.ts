// Load variables defined in the `.env` file
require('dotenv').config();

export const environment = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
      encrypt: false
    }
  },
  common: {
    genericErrorMessage: 'There was a problem. Please try again...',
    tokenTimeStamp: 15,
    pathImage: 'img\\',
    iconPath: 'app/assets/img/',
    iconPath2: 'Iconos\\',
    defaultIcono: 'default.png',
    defaultImage: 'vickgenerico.png',
    domain: process.env.CLIENT_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    timestamp: 15
  }
};
