import React from 'react';
import styles from './styles.module.scss';
import whiteSpinner from '../../../../assets/white-spinner.gif';

export default function LoginButton({ onClick, loading, type = 'button' }) {
  return (
    <button className={styles.button} onClick={onClick} disabled={loading} type={type}>
      {!loading && <span>Log in</span>}
      {loading && <img src={whiteSpinner} alt="Loading..." />}
    </button>
  );
}
