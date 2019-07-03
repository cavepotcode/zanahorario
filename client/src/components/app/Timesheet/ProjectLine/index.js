import React from 'react';
import styles from './styles.module.scss';

export default function ProjectLine({ project }) {
  const week = new Array(7).fill(0);
  return (
    <div className={styles.container}>
      <div className={styles.title}>{project.name}</div>
      {week.map(() => (
        <input />
      ))}
    </div>
  );
}
