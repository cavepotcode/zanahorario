import api from '../utils/api';
import { apiUrls } from '../urls';
import { IStore, IState } from './store';

export interface IProjectState {
  loaded: boolean;
}

const initalState = {
  items: [],
  loading: false,
  error: null,
  loaded: false
};

export default function(store: IStore) {
  store.on('@init', () => ({ projects: initalState }));

  store.on('projects/start', ({ projects }: IState) => ({ projects: { ...projects, loading: true } }));

  store.on('projects/success', ({ projects }: IState, items: any[]) => ({
    projects: { items, error: null, loaded: true, loading: false }
  }));

  store.on('projects/fetch', async (state: IState) => {
    if (!state.projects.loaded) {
      store.dispatch('projects/start');
      try {
        const { data: items } = await api.get(apiUrls.projects.index);
        store.dispatch('projects/success', items);
      } catch (error) {
        return { projects: { ...state.projects, error, loading: false } };
      }
    }
  });
}
