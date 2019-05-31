import React from 'react';
import { Router } from '@reach/router';
import styles from './styles.module.scss';
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

      <Router>
        <Bills path="bills" />
        <Expenses path="expenses" />
        <Projects path="projects" />
        <Settings path="settings" />
        <Timesheet path="timesheet" />
        <Users path="users" />
      </Router>
    </section>
  );
}
