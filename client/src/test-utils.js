import React from 'react';
import { render } from '@testing-library/react';
import StoreContext from 'storeon/react/context';
import SnackbarProvider from './components/Snackbar';
import { store } from './store';

// TODO: create mocked SnackbarProvider, export addNotification spy

const AllTheProviders = ({ children }) => {
  return (
    <StoreContext.Provider value={store}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </StoreContext.Provider>
  );
};

const customRender = (ui, options, data) => {
  if (data && data.projects) {
    store.dispatch('projects/success', data.projects);
  }
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
