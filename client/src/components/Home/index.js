import React from 'react';
import { Router, Link } from '@reach/router';
import styles from './styles.module.scss';
import { PrivateRoute, PublicRoute } from '../Route';
import Bills from '../Bills';
import Expenses from '../Expenses';
import Projects from '../Projects';
import Settings from '../Settings';
import Timesheet from '../Timesheet';
import Users from '../Users';

export default function Home() {
  return (
    <section className={styles.home}>
      <header>header here</header>
      <div>side bar</div>

      <Link to="/projects">Projects</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/who">Somewhere</Link>

      <Router>
        <PrivateRoute component={Bills} path="bills" />
        <PrivateRoute component={Expenses} path="expenses" />
        <PrivateRoute component={Projects} path="projects" />
        <PrivateRoute component={Settings} path="settings" />
        <PrivateRoute component={Timesheet} path="timesheet" />
        <PrivateRoute component={Users} path="users" />
        <PublicRoute component={NotFound} path="*" default />
      </Router>
    </section>
  );
}

function NotFound() {
  return <div>Page Not Found</div>;
}
