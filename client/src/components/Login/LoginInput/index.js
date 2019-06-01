import React from 'react';
import styles from './styles.module.scss';
import classes from '../../../utils/classes';

export default function LoginInput({ type, className, ...props }) {
  const cssClass = classes(styles.input, className);
  return <input className={cssClass} type={type || 'text'} {...props} />;
}
