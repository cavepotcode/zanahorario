import React from 'react';
import { BasicText, asField } from 'informed';
import styles from './styles.module.scss';

function LoginInput({ fieldState, ...props }) {
  return (
    <div className={styles.container}>
      <BasicText fieldState={fieldState} {...props} style={fieldState.error ? { border: '4px solid red' } : null} />
      <div data-testid="error-msg" className={styles.error}>
        {fieldState.error}
      </div>
    </div>
  );
}

export default asField(LoginInput);
