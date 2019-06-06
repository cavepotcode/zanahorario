import React from 'react';
import { Router } from '@reach/router';
import StoreContext from 'storeon/react/context';
import { PrivateRoute, PublicRoute } from '../../Route';
import Home from '../Home';
import Login from '../Login';
import SnackbarProvider from '../../Snackbar';
import { store } from '../../../store';
import './App.css';

function App() {
  return (
    <main>
      <StoreContext.Provider value={store}>
        <SnackbarProvider>
          <Router>
            <PublicRoute component={Login} path="login" />
            <PrivateRoute component={Home} path="/*" />
          </Router>
        </SnackbarProvider>
      </StoreContext.Provider>
    </main>
  );
}

export default App;
