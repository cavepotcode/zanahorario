import React from 'react';
import useStoreon from 'storeon/react';
import styles from './styles.module.scss';
import classes from '../../../utils/classes';

type Props = {
  keys: string;
};

export default function HotkeyHelp({ keys }: Props) {
  const { help } = useStoreon('help');
  if (!help) {
    return null;
  }

  const value = parseKeys(keys);
  return <code className={classes(styles.hotkey, value.length === 1 && styles.small)}>{value}</code>;
}

function parseKeys(hotkey: string) {
  const keys = hotkey.split('+');
  const result = keys.map(key => {
    switch (key) {
      case 'right':
        return '→';
      case 'left':
        return '←';
      case 'shift':
        return '⇧';
      default:
        return key;
    }
  });

  return result.join('');
}
