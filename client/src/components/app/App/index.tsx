import React from 'react';
import { Router } from '@reach/router';
import StoreContext from 'storeon/react/context';
import mousetrap from 'mousetrap';
import { PrivateRoute, PublicRoute } from '../../Route';
import Home from '../Home';
import Login from '../Login';
import SnackbarProvider from '../../Snackbar';
import { store } from '../../../store';
import hotkeys from '../../../hotkeys';

function App() {
  React.useEffect(() => {
    mousetrap.bind(hotkeys.help, () => {
      store.dispatch('help/show');
    });

    return () => {
      mousetrap.unbind(hotkeys.help);
    }
  }, []);

  return (
    <StoreContext.Provider value={store}>
      <SnackbarProvider>
        <Router>
          <PublicRoute component={Login} path="login" />
          <PrivateRoute component={Home} path="/*" />
        </Router>
      </SnackbarProvider>
    </StoreContext.Provider>
  );
}

export default App;
