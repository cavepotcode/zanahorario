import React from 'react';
import styles from './styles.module.scss';
import grid from '../grid.module.scss';
import classes from '../../../../utils/classes';

// TODO: validate input (numeric, <= 24)
export default function ProjectLine({ project, entries, onEntered }) {
  return (
    <div className={classes(styles.container, grid.row)}>
      <div className={classes(styles.title, grid.cell, grid.first)}>{project.name}</div>
      {entries.map(entry => (
        <input
          className={grid.cell}
          key={entry.date}
          onBlur={e => handleEntered(e, entry)}
          defaultValue={entry.hours}
        />
      ))}
    </div>
  );

  function handleEntered(event, entry) {
    const hours = Number(event.target.value) || null;
    if (hours !== entry.hours) {
      onEntered(project.id, { ...entry, hours });
    }
  }
}
