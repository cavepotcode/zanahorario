import React from 'react';
import styles from './styles.module.scss';
import classes from '../../../utils/classes';

type Props = {
  disabled: boolean;
  left?: boolean;
  onClick: Function;
  right?: boolean;
  show: boolean;
  step: number;
};

export default function Arrow({ disabled, left, onClick, right, show, step }: Props) {
  if (!show) {
    return null;
  }
  return (
    <i
      onClick={() => !disabled && onClick(step)}
      className={classes(styles.arrow, right && styles.right, left && styles.left, disabled && styles.disabled)}
    />
  );
}
