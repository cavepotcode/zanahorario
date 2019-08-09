import React from 'react';
import styles from './styles.module.scss';
import logo from '../../../../assets/zanaLogo.png';
import grass from '../../../../assets/Homegrass.png';
import MenuItem from './MenuItem';

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <header>
        <img src={logo} alt="zanahorario" className={styles.logo} />
      </header>
      <ul>
        <MenuItem to="/timesheet" title="My time" keys="m" />
        <MenuItem to="/projects" title="Projects" keys="p" />
        <MenuItem to="/users" title="Users" keys="u" />
        <MenuItem to="/settings" title="Settings" keys="s" />
        <MenuItem to="/accounting" title="Accounting" keys="a" />
        <MenuItem to="/billing" title="Billing" keys="b" />
      </ul>
      <footer>
        <img src={grass} alt="zanahorario" />
      </footer>
    </nav>
  );
}
