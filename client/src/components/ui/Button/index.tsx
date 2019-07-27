import React from 'react';
import styles from './styles.module.scss';
import classes from '../../../utils/classes';

type Props = {
  children: any;
  disabled?: boolean;
  onClick?: (event: any) => void;
  type?: 'submit' | 'button';
};

export default function Button({ children, onClick = () => {}, type = 'submit', ...props }: Props) {
  return (
    <button onClick={onClick} type={type} className={classes("ripple", styles.button)} {...props}>
      {children}
    </button>
  );
}
