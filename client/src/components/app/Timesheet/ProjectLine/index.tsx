import React from 'react';
import styles from './styles.module.scss';
import HoursInput from './HoursInput';
import grid from '../grid.module.scss';
import classes from '../../../../utils/classes';
import { format } from '../../../../utils/date';
import { IProject } from '../interfaces';

type Props = {
  startDate: Date;
  project: IProject;
  errors: any;
};

// TODO: connect to store to get project by id
export default function ProjectLine({ startDate, project, errors }: Props) {
  const entries = getEntries(startDate);
  return (
    <div className={classes(styles.container, grid.row)} data-test-project={project.id}>
      <div className={classes(styles.title, grid.cell, grid.first)}>{project.name}</div>
      {entries.map(entry => {
        const date = format(entry);
        const name = `hours.${project.id}.${date}`;
        return <HoursInput key={name} name={name} error={errors[date]} />;
      })}
    </div>
  );

  function getEntries(startDate: Date) {
    let date = new Date(startDate);
    const result = [];
    for (let i = 0; i < 7; i++) {
      result.push(date);

      date = new Date(date);
      date.setDate(date.getDate() + 1);
    }
    return result;
  }
}
