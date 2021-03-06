import createStore from 'storeon';
import help from './help';
import user from './user';
import projects from './projects';

const isDev = !['production', 'test'].includes(process.env.NODE_ENV);
export const store = createStore([help, user, projects, isDev && require('storeon/devtools')]);
