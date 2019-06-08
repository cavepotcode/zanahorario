import React from 'react';
import styles from './styles.module.scss';
import Arrow from '../Arrow';

export default function UsersCarousel({ entries, max = 3 }) {
  const [userIndex, setIndex] = React.useState(0);
  const [entriesWindow, setWindow] = React.useState([]);

  React.useEffect(() => {
    if (userIndex >= 0 && userIndex + max <= entries.length) {
      const entriesList = entries.slice(userIndex, userIndex + max);
      setWindow(entriesList);
    }
  }, [userIndex, max, entries]);

  const showArrows = entries.length > max;
  const disabledPrev = userIndex === 0;
  const disableNext = userIndex + max >= entries.length;

  return (
    <div className={styles.carousel}>
      <Arrow show={showArrows} left onClick={moveWindow} step={-1} disabled={disabledPrev} />

      {entriesWindow.map(({ user, hours }) => (
        <div className={styles.user} key={user.initials}>
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
