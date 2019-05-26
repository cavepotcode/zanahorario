import React from 'react';
import { Router, Link } from '@reach/router';
import Home from '../Home';
import Login from '../Login';
import Bills from '../Bills';
import Expenses from '../Expenses';
import Projects from '../Projects';
import Settings from '../Settings';
import Timesheet from '../Timesheet';
import Users from '../Users';
import './App.css';

function App() {
  return (
    <main>
      <h1>Welcome to zanahorario</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="login">Login</Link>
        </li>
        <li>
          <Link to="bills">Bills</Link>
        </li>
        <li>
          <Link to="expenses">Expenses</Link>
        </li>
        <li>
          <Link to="projects">Projects</Link>
        </li>
        <li>
          <Link to="settings">Settings</Link>
        </li>
        <li>
          <Link to="timesheet">Timesheet</Link>
        </li>
        <li>
          <Link to="users">users</Link>
        </li>
      </ul>

      <Router>
        <Home path="/" />
        <Login path="login" />
        <Bills path="bills" />
        <Expenses path="expenses" />
        <Projects path="projects" />
        <Settings path="settings" />
        <Timesheet path="timesheet" />
        <Users path="users" />
      </Router>
    </main>
  );
}

export default App;
