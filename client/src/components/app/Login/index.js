import React from 'react';
import { Form } from 'informed';
import useStoreon from 'storeon/react';
import LoginInput from './LoginInput';
import Button from './LoginButton';
import styles from './styles.module.scss';
import validators from './validators';
import api from '../../../utils/api';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';
import logo from '../../../assets/zanaLogo.png';

export default function Login() {
  const { dispatch } = useStoreon();
  const { addNotification } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const validatePassword = val => validators.required(val, 'Password');

  return (
    <section className={styles.section}>
      <img src={logo} alt="zanahorario" className={styles.logo} />
      <Form noValidate onSubmit={onSubmit}>
        <LoginInput validateOnChange validate={validators.email} field="email" type="email" />
        <LoginInput validateOnChange validate={validatePassword} field="password" type="password" />
        <Button loading={loading}>Log in</Button>
        <span>&iquest;Olvidaste tu contrase&ntilde;a?</span>
      </Form>
      <footer className={styles.footer} />
    </section>
  );

  async function onSubmit(creds) {
    try {
      setLoading(true);
      const { data, meta } = await api.post(apiUrls.login, creds);
      if (meta && meta.code) {
        return addNotification(meta.message);
      }
      localStorage.setItem('access_token', data.token);
      dispatch('authenticate', data.email);
    } catch (err) {
      addNotification(err.message);
    } finally {
      setLoading(false);
    }
  }
}
