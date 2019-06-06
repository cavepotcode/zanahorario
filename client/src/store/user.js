import { navigate } from '@reach/router';

export default function(store) {
  store.on('@init', () => ({ user: {} }));

  store.on('authenticate', (store, email) => {
    navigate('/');
    return { user: { email, isAuthenticated: true } };
  });
}
