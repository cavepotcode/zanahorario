export const environment = {
  name: 'dev',
  db: {
    user: '****',
    password: '*************!',
    server: '**************',
    database: '********',
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
    secret: '*************************',
    timestamp: 15
  }
};
