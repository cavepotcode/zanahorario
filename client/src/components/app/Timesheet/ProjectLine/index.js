import React from 'react';
import styles from './styles.module.scss';
import HoursInput from './HoursInput';
import grid from '../grid.module.scss';
import classes from '../../../../utils/classes';

export default function ProjectLine({ project, entries, onEntered }) {
  return (
    <div className={classes(styles.container, grid.row)}>
      <div className={classes(styles.title, grid.cell, grid.first)}>{project.name}</div>
      {entries.map(entry => (
        <HoursInput
          field={`hours_${project.id}_${entry.date.toDateString()}`}
          initialValue={entry.hours}
          key={entry.date}
          onBlur={e => handleEntered(e, entry)}
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
