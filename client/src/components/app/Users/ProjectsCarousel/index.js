import React from 'react';
import styles from './styles.module.scss';
import classes from '../../../../utils/classes';
import Arrow from '../../../ui/Arrow';

export default function ProjectsCarousel({ entries, max }) {
  const [index, setIndex] = React.useState(0);
  const [entriesWindow, setWindow] = React.useState([]);

  React.useEffect(() => {
    if (index >= 0) {
      if (index + max <= entries.length) {
        const entriesList = entries.slice(index, index + max);
        setWindow(entriesList);
      } else {
        setWindow(entries);
      }
    }
  }, [index, max, entries]);

  const showArrows = entries.length > max;
  const disabledPrev = index === 0;
  const disableNext = index + max >= entries.length;

  return (
    <div className={styles.carousel}>
      <Arrow show={showArrows} left onClick={moveWindow} step={-1} disabled={disabledPrev} />

      {entriesWindow.map(({ project, hours }, index) => (
        <div className={classes(styles.project, index === entriesWindow.length - 1 && styles.last)} key={project.id}>
          <div className={styles.name}>{project.name}</div>
          <div>{hours}</div>
        </div>
      ))}

      <Arrow show={showArrows} right onClick={moveWindow} step={1} disabled={disableNext} />
    </div>
  );

  function moveWindow(step) {
    setIndex(index + step);
  }
}
