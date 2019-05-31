import React from 'react';
import styles from './styles.module.scss';

export default function LoginButton({ onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      Log in
    </button>
  );
}
