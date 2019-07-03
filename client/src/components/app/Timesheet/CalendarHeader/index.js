import React from 'react';
import styles from './styles.module.scss';
import { getWeekdayName } from '../../../../utils/date';
import classes from '../../../../utils/classes';

export default function CalendarHeader({ startDate }) {
  const week = new Array(7).fill(0);
  return (
    <div className={styles.container}>
      <div className={styles.title}>Project</div>
      {week.map((_, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        return <CalendarCard date={date} />;
      })}
    </div>
  );
}

function CalendarCard({ date, index }) {
  const weekdate = date.getDate();
  const isWeekend = [0, 6].includes(date.getDay());
  const name = getWeekdayName(date);
  return (
    <div className={classes(styles.date, isWeekend && styles.secondary)}>
      <div>{weekdate}</div>
      <div>{name}</div>
    </div>
  );
}
