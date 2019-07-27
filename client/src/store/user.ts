import { navigate } from '@reach/router';
import { IStore, IState } from './store';

const STORAGE_KEY = 'access_token';

export interface IUserState {
  userId: number;
  recentProjects: number[];
  isAuthenticated: boolean;
}

export default function(store: IStore) {
  store.on('@init', () => ({ user: decodeToken() }));

  store.on('authenticate', (state: IState, { email, token }: any) => {
    navigate('/projects');
    localStorage.setItem(STORAGE_KEY, token);
    const { recentProjects } = decodeToken(token);
    return { user: { email, recentProjects, isAuthenticated: true } };
  });
}

function decodeToken(token = localStorage.getItem(STORAGE_KEY)) {
  if (token) {
    const [, payload] = token.split('.');
    const { userId, recentProjects } = JSON.parse(atob(payload));
    return { userId, recentProjects, isAuthenticated: true };
  }
  return { recentProjects: [] };
}
