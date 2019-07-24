import { navigate } from '@reach/router';
import { IStore, IState } from './store';

const STORAGE_KEY = 'access_token';

export interface IUserState {}

export default function(store: IStore) {
  store.on('@init', () => ({ user: decodeToken() }));

  store.on('authenticate', (state: IState, { email, token }: any) => {
    navigate('/projects');
    localStorage.setItem(STORAGE_KEY, token);
    return { user: { email, isAuthenticated: true } };
  });
}

function decodeToken() {
  const token = localStorage.getItem(STORAGE_KEY);
  if (token) {
    const [, payload] = token.split('.');
    const { userId } = JSON.parse(atob(payload));
    return { userId, isAuthenticated: true };
  }
  return {};
}
