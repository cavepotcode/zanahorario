import React from 'react';
import LoginInput from './LoginInput';
import Button from './LoginButton';
import styles from './styles.module.scss';
import logo from '../../assets/zanaLogo.png';
import api from '../../utils/api';
import { apiUrls } from '../../urls';
import useSnackbar from '../Snackbar/useSnackbar';

export default function Login() {
  const { addNotification } = useSnackbar();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  return (
    <section className={styles.section}>
      <img src={logo} alt="zanahorario" className={styles.logo} />
      <form onSubmit={onSubmit}>
        <LoginInput type="email" onChange={e => setEmail(e.target.value)} />
        <LoginInput type="password" onChange={e => setPassword(e.target.value)} />
        <Button loading={loading}>Log in</Button>
        <span>&iquest;Olvidaste tu contrase&ntilde;a?</span>
      </form>
      <footer className={styles.footer} />
    </section>
  );

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const { data, meta } = await api.post(apiUrls.login, { email, password });
      if (meta && meta.code) {
        return addNotification(meta.message);
      }
      localStorage.setItem('access_token', data.token);
    } catch (err) {
      addNotification(err.message);
    } finally {
      setLoading(false);
    }
  }
}
