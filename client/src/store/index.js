import createStore from 'storeon';
import user from './user';

const isDev = !['production', 'test'].includes(process.env.NODE_ENV);
export const store = createStore([user, isDev && require('storeon/devtools')]);
