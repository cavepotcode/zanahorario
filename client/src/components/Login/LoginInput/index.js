import React from 'react';
import styles from './styles.module.scss';
import classes from '../../../utils/classes';

export default function LoginInput({ type, className, onChange }) {
  const cssClass = classes(styles.input, className);
  return <input className={cssClass} type={type || 'text'} onChange={onChange} />;
}
