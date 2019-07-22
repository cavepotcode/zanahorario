import React from 'react';
import styles from './styles.module.scss';

type Props = {
  children: React.Node,
  disabled?: boolean,
  onClick?: Function,
  type?: string
};
export default function Button({ children, onClick = () => null, type = 'submit', ...props }: Props) {
  return (
    <button onClick={onClick} type={type} className={styles.button} {...props}>
      {children}
    </button>
  );
}
