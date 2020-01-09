import React from 'react';
import styles from './styles.module.scss';
import classes from '../../../../utils/classes';
import Typography from '@material-ui/core/Typography';
import Item from './Item';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

interface IProps {
  className: string;
  isTotalOut: boolean;
  title: string;
}

export default function Summary({ className, isTotalOut, title }: IProps) {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        {isTotalOut ? (
          <MoneyOffIcon className={classes(className, styles.moneyImg)} />
        ) : (
          <AttachMoneyIcon className={classes(className, styles.moneyImg)} />
        )}
      </div>
      <div className={styles.content}>
        <span className={classes(className, styles.header)}>
          <Typography component="h2" variant="h5" className={styles.title}>
            {title}
          </Typography>
          <AddCircleOutlineIcon className={styles.icon} />
        </span>
        <div className={styles.info}>
          <Item className={className} label="Total $" value="14238.00" />
          <Item className={className} label="Pending debt $" value="1000.00" />
          <Item className={className} label="Total US$" value="15500.00" />
          <Item className={className} label="Pending debt US$" value="500.00" />
        </div>
      </div>
    </div>
  );
}
