import React from 'react';
import LoginInput from './LoginInput';
import Button from './LoginButton';
import styles from './styles.module.scss';
import logo from '../../assets/zanaLogo.png';
import api from '../../utils/api';
import { apiUrls } from '../../urls';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <section className={styles.section}>
      <img src={logo} alt="zanahorario" className={styles.logo} />
      <form onSubmit={onSubmit}>
        <LoginInput type="email" name="email" onChange={e => setEmail(e.target.value)} />
        <LoginInput type="password" name="password" onChange={e => setPassword(e.target.value)} />
        <Button>Log in</Button>
        <span className={styles.link}>&iquest;Has olvidado tu contrase&ntilde;a?</span>
      </form>
      <footer className={styles.footer} />
    </section>
  );

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const { data, meta } = await api.post(apiUrls.login, { email, password });
      if (meta && meta.code) {
        return handleError(meta);
      }
      localStorage.setItem('access_token', data.token);
      alert('login succeeded');
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err) {
    alert(err.message);
  }
}
