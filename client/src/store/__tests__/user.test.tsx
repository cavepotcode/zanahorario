import createStore from 'storeon';
import { navigate } from '@reach/router';
import userStore from '../user';

describe('User Store', () => {
  it('should authenticate user', async () => {
    const email = 'test@cavepot.com';
    const store = createStore([userStore]);

    store.dispatch('authenticate', { email, token: null });
    expect(navigate).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/projects');

    expect(store.get().user).toEqual({ email, recentProjects: [], isAuthenticated: true });
  });
});
