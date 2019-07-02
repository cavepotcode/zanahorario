import { navigate } from '@reach/router';

const STORAGE_KEY = 'access_token';

export default function(store) {
  store.on('@init', () => ({ user: decodeToken() }));

  store.on('authenticate', (store, { email, token }) => {
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
    return { isAuthenticated: true, userId };
  }
  return {};
}
