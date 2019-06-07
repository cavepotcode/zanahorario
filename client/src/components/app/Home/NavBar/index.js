import React from 'react';
import { Link } from '@reach/router';
import styles from './styles.module.scss';
import logo from '../../../../assets/zanaLogo.png';
import grass from '../../../../assets/Homegrass.png';

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <header>
        <img src={logo} alt="zanahorario" className={styles.logo} />
      </header>
      <ul>
        <MenuItem to="/timesheet" title="My time" />
        <MenuItem to="/projects" title="Projects" />
        <MenuItem to="/users" title="Users" />
        <MenuItem to="/settings" title="Settings" />
        <MenuItem to="/accounting" title="Accounting" />
        <MenuItem to="/billing" title="Billing" />
      </ul>
      <footer>
        <img src={grass} alt="zanahorario" />
      </footer>
    </nav>
  );
}

function MenuItem({ title, to }) {
  const isActive = ({ isCurrent }) => {
    return isCurrent ? { className: styles.active } : null;
  };

  return (
    <li>
      <Link to={to} getProps={isActive}>
        {title}
      </Link>
    </li>
  );
}
