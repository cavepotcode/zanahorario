export const environment = {
  db: {
    user: 'sa',
    password: 'n1rvanA!',
    server: 'cavepotlab.com',
    database: 'timetracker',
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
    domain: 'http://localhost:4200/ '
  },
  jwt: {
    secret: 'esto es zanahorario',
    timestamp: 15
  }
};
