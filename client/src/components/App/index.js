import React from 'react';
import { Router } from '@reach/router';
import Home from '../Home';
import Login from '../Login';
import SnackbarProvider from '../Snackbar';
import './App.css';

function App() {
  return (
    <main>
      <SnackbarProvider>
        <Router>
          <Login path="login" />
          <Home path="/" />
        </Router>
      </SnackbarProvider>
    </main>
  );
}

export default App;
