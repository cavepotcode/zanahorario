import React from 'react';
import LoginInput from './LoginInput';
import Button from './LoginButton';
import styles from './styles.module.scss';
import logo from '../../assets/zanaLogo.png';

export default function Login() {
  return (
    <section className={styles.section}>
      <img src={logo} alt="zanahorario" className={styles.logo} />
      <LoginInput type="email" />
      <LoginInput type="password" />
      <Button>Log in</Button>
      <a className={styles.link} href="#">
        &iquest;Has olvidado tu contrase&ntilde;a?
      </a>
      <footer className={styles.footer} />
    </section>
  );
}
