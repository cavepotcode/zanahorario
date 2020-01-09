import React from 'react';
import styles from './styles.module.scss';
import Typography from '@material-ui/core/Typography';
import Item from '../Summary/Item';

interface IProps {
  title: string;
  image?: any;
  //TODO: values
}

export default function Card({ title }: IProps) {
  return (
    <div className={styles.container}>
      <Typography component="h2" variant="h6" className={styles.title}>
        {title}
      </Typography>
      <div className={styles.info}>
        <Item className={styles.row} label="Total $" value="14238.00" />
        <Item className={styles.row} label="Pending debt $" value="1000.00" />
        <Item className={styles.row} label="Total US$" value="15500.00" />
        <Item className={styles.row} label="Pending debt US$" value="500.00" />
      </div>
    </div>
  );
}
