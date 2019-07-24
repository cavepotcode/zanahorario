import React from 'react';
import styles from './styles.module.scss';

type Props = {
  children: any;
  disabled?: boolean;
  onClick?: (event: any) => void;
  type?: 'submit' | 'button';
};

export default function Button({ children, onClick = () => {}, type = 'submit', ...props }: Props) {
  return (
    <button onClick={onClick} type={type} className={styles.button} {...props}>
      {children}
    </button>
  );
}
