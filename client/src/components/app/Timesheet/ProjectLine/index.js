import React from 'react';
import styles from './styles.module.scss';
import grid from '../grid.module.scss';
import classes from '../../../../utils/classes';

export default function ProjectLine({ project }) {
  const week = new Array(7).fill(0);
  return (
    <div className={classes(styles.container, grid.row)}>
      <div className={classes(styles.title, grid.cell, grid.first)}>{project.name}</div>
      {week.map(() => (
        <input className={grid.cell} />
      ))}
    </div>
  );
}
