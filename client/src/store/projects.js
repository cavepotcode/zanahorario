import api from '../utils/api';
import { apiUrls } from '../urls';

const initalState = {
  items: [],
  loading: false,
  error: null,
  loaded: false
};

export default function(store) {
  store.on('@init', () => ({ projects: initalState }));

  store.on('projects/start', ({ projects }) => ({ projects: { ...projects, loading: true } }));

  store.on('projects/success', ({ projects }, items) => ({
    projects: { error: null, loaded: true, loading: false, items }
  }));

  store.on('projects/fetch', async state => {
    if (!state.projects.loaded) {
      store.dispatch('projects/start');
      try {
        const { data: items } = await api.get(apiUrls.projects.index);
        store.dispatch('projects/success', items);
      } catch (error) {
        return { projects: { ...state.projects, loading: false, error } };
      }
    }
  });
}
