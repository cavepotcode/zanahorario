import React from 'react';
import styles from './styles.module.scss';
import whiteSpinner from '../../../../assets/white-spinner.gif';

type Props = {
  children: any;
  loading?: boolean;
  onClick?: ((event: any) => void);
  type?: "button" | "submit" | "reset";
};

export default function LoginButton({ onClick, loading, type = 'button' }: Props) {
  return (
    <button className={styles.button} onClick={onClick} disabled={loading} type={type}>
      {!loading && <span>Log in</span>}
      {loading && <img src={whiteSpinner} alt="Loading..." />}
    </button>
  );
}
