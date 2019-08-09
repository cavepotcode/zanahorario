import React from 'react';
import { Link, LinkGetProps, navigate } from '@reach/router';
import HotkeyHelp from '../../../ui/HotkeyHelp';
import styles from './styles.module.scss';
import useHotkey from '../../../../hooks/useHotkey';

type MenuItemsProps = {
  to: string;
  keys: string;
  title: string;
};

export default function MenuItem({ to, keys, title }: MenuItemsProps) {
  useHotkey(keys, () => navigate(to));

  const isActive = ({ isCurrent }: LinkGetProps) => {
    return isCurrent ? { className: styles.active } : {};
  };

  return (
    <li>
      <Link to={to} getProps={isActive}>
        {title}
        <HotkeyHelp keys={keys} />
      </Link>
    </li>
  );
}
