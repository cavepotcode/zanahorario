import createStore from 'storeon';
import projectsStore from '../projects';
import api from '../../utils/api';

jest.mock('../../utils/api');

describe('Projects Store', () => {
  it('should authenticate user', async () => {
    const email = 'test@cavepot.com';
    const store = createStore([projectsStore]);

    const data = [{ id: 1, name: 'Random' }];
    const response = { code: 0, data };
    api.get.mockReturnValueOnce(response);
    store.dispatch('projects/fetch');

    setImmediate(() => {
      expect(store.get().projects).toBeTruthy();
      expect(store.get().projects.items).toBe(data);
    });
  });
});
