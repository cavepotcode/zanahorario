import React from 'react';
import styles from './styles.module.scss';
import whiteSpinner from '../../../assets/white-spinner.gif';

export default function LoginButton({ onClick, loading }) {
  return (
    <button className={styles.button} onClick={onClick} disabled={loading}>
      {!loading && <span>Log in</span>}
      {loading && <img src={whiteSpinner} alt="Loading..." />}
    </button>
  );
}
