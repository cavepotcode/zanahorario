import React from 'react';
import styles from './styles.module.scss';

export default function Button({ children, onClick, type = 'submit', ...props }) {
  return (
    <button onClick={onClick} type={type} className={styles.button} {...props}>
      {children}
    </button>
  );
}
