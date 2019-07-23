import React from 'react';
import { Field } from 'formik';
import styles from './styles.module.scss';

export default function LoginInput({ error, ...props }) {
  return (
    <div className={styles.container}>
      <Field {...props} style={error ? { border: '4px solid red' } : null} />
      <div data-testid={error ? 'error-msg' : ''} className={styles.error}>
        {error}
      </div>
    </div>
  );
}
