import React from 'react';
import mousetrap from 'mousetrap';
import { Link, LinkGetProps, navigate } from '@reach/router';
import HotkeyHelp from '../../../ui/HotkeyHelp';
import styles from './styles.module.scss';

type MenuItemsProps = {
  to: string;
  keys: string;
  title: string;
};

export default function MenuItem({ to, keys, title }: MenuItemsProps) {
  const isActive = ({ isCurrent }: LinkGetProps) => {
    return isCurrent ? { className: styles.active } : {};
  };

  React.useEffect(() => {
    mousetrap.bind(keys, () => {
      navigate(to);
    });

    return () => {
      mousetrap.unbind(keys);
    };
  }, [keys, to]);

  return (
    <li>
      <Link to={to} getProps={isActive}>
        {title}
        <HotkeyHelp keys={keys} />
      </Link>
    </li>
  );
}

