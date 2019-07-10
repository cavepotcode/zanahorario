import React from 'react';
import styles from './styles.module.scss';
import classes from '../../../../utils/classes';
import Arrow from '../Arrow';

export default function UsersCarousel({ entries, max = 3 }) {
  const [userIndex, setIndex] = React.useState(0);
  const [entriesWindow, setWindow] = React.useState([]);

  React.useEffect(() => {
    if (userIndex >= 0) {
      if (userIndex + max <= entries.length) {
        const entriesList = entries.slice(userIndex, userIndex + max);
        setWindow(entriesList);
      } else {
        setWindow(entries);
      }
    }
  }, [userIndex, max, entries]);

  const showArrows = entries.length > max;
  const disabledPrev = userIndex === 0;
  const disableNext = userIndex + max >= entries.length;

  return (
    <div className={styles.carousel}>
      <Arrow show={showArrows} left onClick={moveWindow} step={-1} disabled={disabledPrev} />

      {entriesWindow.map(({ user, hours }, index) => (
        <div className={classes(styles.user, index === entriesWindow.length - 1 && styles.last)} key={user.id}>
          <div>{user.initials}</div>
          <div>{hours}</div>
        </div>
      ))}

      <Arrow show={showArrows} right onClick={moveWindow} step={1} disabled={disableNext} />
    </div>
  );

  function moveWindow(step) {
    setIndex(userIndex + step);
  }
}
