import React from 'react';
import styles from './styles.module.scss';
import grid from '../grid.module.scss';
import classes from '../../../../utils/classes';

export default function NewProject({ projects, onSelect }) {
  return (
    <div className={classes(styles.container, grid.row)}>
      <select onChange={handleSelect}>
        <option value="0">Choose project</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );

  function handleSelect(event) {
    const id = event.target.value;
    const project = projects.find(proj => proj.id === Number(id));
    onSelect(project);
  }
}
