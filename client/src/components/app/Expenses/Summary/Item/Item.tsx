import React from 'react';
import styles from './styles.module.scss';
import OutlinedInput from '@material-ui/core/OutlinedInput';

interface IProps {
  className?: string;
  label: string;
  value: string;
}

export default function Item({ className, label, value }: IProps) {
  return (
    <div className={styles.item}>
      <span className={className && className}>{label}</span>
      <OutlinedInput className={styles.input} labelWidth={0} value={value} disabled={true} />
    </div>
  );
}
