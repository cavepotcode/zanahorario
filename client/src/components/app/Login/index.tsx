import React from 'react';
import { Formik, Form } from 'formik';
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
  const validatePassword = (val: string) => validators.required(val, 'Password');

  return (
    <section className={styles.section}>
      <img src={logo} alt="zanahorario" className={styles.logo} />
      <Formik initialValues={{ password: '', email: '' }} onSubmit={onSubmit}>
        {({ errors, touched, isValidating }) => (
          <Form noValidate>
            <LoginInput
              error={touched.email ? errors.email : undefined}
              name="email"
              placeholder="Email"
              type="email"
              validate={validators.email}
            />
            <LoginInput
              error={touched.password ? errors.password : undefined}
              name="password"
              placeholder="Password"
              type="password"
              validate={validatePassword}
            />
            <Button type="submit" loading={loading}>
              Log in
            </Button>
            <span>&iquest;Olvidaste tu contrase&ntilde;a?</span>
          </Form>
        )}
      </Formik>

      <footer className={styles.footer} />
    </section>
  );

  async function onSubmit(creds: { email: string, password: string }) {
    try {
      setLoading(true);
      const { data, meta } = await api.post(apiUrls.login, creds);
      if (meta && meta.code) {
        return addNotification(meta.message);
      }
      dispatch('authenticate', { email: creds.email, token: data });
    } catch (err) {
      addNotification(err.message);
    } finally {
      setLoading(false);
    }
  }
}
