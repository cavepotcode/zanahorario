import { navigate } from '@reach/router';

export default function(store) {
  store.on('@init', () => ({ user: decodeToken() }));

  store.on('authenticate', (store, email) => {
    navigate('/projects');
    return { user: { email, isAuthenticated: true } };
  });
}

function decodeToken() {
  const token = localStorage.getItem('access_token');
  if (token) {
    const [, payload] = token.split('.');
    const { email } = JSON.parse(atob(payload));
    return { isAuthenticated: true, email };
  }
  return {};
}
