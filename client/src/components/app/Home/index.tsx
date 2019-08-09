import React from 'react';
import { Router } from '@reach/router';
import NavBar from './NavBar';
import styles from './styles.module.scss';
import { PrivateRoute, PublicRoute } from '../../Route';
import Bills from '../Bills';
import Expenses from '../Expenses';
import Projects from '../Projects';
import Settings from '../Settings';
import Timesheet from '../Timesheet';
import Users from '../Users';
import FooterTips from '../../ui/FooterTips';

export default function Home() {
  return (
    <div className={styles.home}>
      <NavBar />
      <section>
        <Router>
          <PrivateRoute component={Bills} path="billing" />
          <PrivateRoute component={Expenses} path="accounting" />
          <PrivateRoute component={Projects} path="projects" />
          <PrivateRoute component={Settings} path="settings" />
          <PrivateRoute component={Users} path="users" />
          <PrivateRoute component={Timesheet} path="timesheet" />
          <PublicRoute component={NotFound} path="*" default />
        </Router>
      </section>
      <FooterTips />
    </div>
  );
}

function NotFound() {
  return <div>Page Not Found</div>;
}
