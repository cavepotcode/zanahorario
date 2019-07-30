import React from 'react';
import useStoreon from 'storeon/react';
import styles from './styles.module.scss';
import classes from '../../../utils/classes';

type Props = {
  keys?: string | string[];
};

export default function HotkeyHelp({ keys }: Props) {
  const { help } = useStoreon('help');
  if (!help || !keys) {
    return null;
  }

  const value = parseKeys(keys);
  return <code className={classes(styles.hotkey, value.length === 1 && styles.small)}>{value}</code>;
}

function parseKeys(hotkey: string | string[]) {
  const firstKey = typeof hotkey === "object" ? hotkey[0] : hotkey;
  const keys = firstKey.split('+');
  const result = keys.map(key => {
    switch (key) {
      case 'right':
        return '→';
      case 'left':
        return '←';
      case 'shift':
        return '⇧';
      case 'down':
        return '↓';
      case 'up':
        return '↑';
      case 'enter':
        return '↵';
      default:
        return key;
    }
  });

  return result.join('');
}
