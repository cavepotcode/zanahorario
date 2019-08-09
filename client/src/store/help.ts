import { IStore, IState } from './store';

export default function(store: IStore) {
  let timeout: any;

  store.on('@init', () => ({ help: false }));

  store.on('help/show', (state: IState) => {
    store.dispatch('help/set', true);
    if (timeout) {
      timeout = clearTimeout(timeout);
      store.dispatch('help/set', false);
    } else {
      timeout = setTimeout(() => {
        store.dispatch('help/set', false);
        timeout = null;
      }, 5000);
    }
  });

  store.on('help/set', (state: IState, value: boolean) => {
    return { help: value };
  });
}
