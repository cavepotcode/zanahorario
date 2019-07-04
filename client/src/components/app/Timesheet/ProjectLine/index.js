import React from 'react';
import styles from './styles.module.scss';
import grid from '../grid.module.scss';
import classes from '../../../../utils/classes';

// TODO: validate input (numeric, lt 24)
export default function ProjectLine({ startDate, project, hours, onEntered }) {
  const week = new Array(7).fill(0);

  return (
    <div className={classes(styles.container, grid.row)}>
      <div className={classes(styles.title, grid.cell, grid.first)}>{project.name}</div>
      {week.map((_, index) => (
        <input className={grid.cell} onBlur={e => handleEntered(e, index)} />
      ))}
    </div>
  );

  function handleEntered(event, index) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    onEntered({
      projectId: project.id,
      date,
      hours: Number(event.target.value)
    });
  }
}
