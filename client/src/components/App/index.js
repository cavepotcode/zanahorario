import React from 'react';
import { Router } from '@reach/router';
import Home from '../Home';
import Login from '../Login';
import './App.css';

function App() {
  return (
    <main>
      <Router>
        <Login path="login" />
        <Home path="/" />
      </Router>
    </main>
  );
}

export default App;
