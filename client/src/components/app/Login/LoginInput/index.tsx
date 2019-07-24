import React from 'react';
import { Field } from 'formik';
import styles from './styles.module.scss';

type Props = {
  error?: string;
  name: string;
  placeholder: string;
  type: string;
  validate: Function;
};

export default function LoginInput({ error, ...props }: Props) {
  return (
    <div className={styles.container}>
      <Field {...props} style={error ? { border: '4px solid red' } : null} />
      <div data-testid={error ? 'error-msg' : ''} className={styles.error}>
        {error}
      </div>
    </div>
  );
}
