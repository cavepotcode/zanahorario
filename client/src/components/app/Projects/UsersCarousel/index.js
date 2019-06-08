import React from 'react';
import styles from './styles.module.scss';
import Arrow from '../Arrow';

export default function UsersCarousel({ users, max = 3 }) {
  const [userIndex, setIndex] = React.useState(0);
  const [usersWindow, setWindow] = React.useState([]);

  React.useEffect(() => {
    debugger;
    if (userIndex >= 0 && userIndex + max <= users.length) {
      const usersList = users.slice(userIndex, userIndex + max);
      setWindow(usersList);
    }
  }, [userIndex, max, users]);

  const showArrows = users.length > max;
  const disabledPrev = userIndex === 0;
  const disableNext = userIndex + max >= users.length;

  return (
    <div className={styles.carousel}>
      <Arrow show={showArrows} left onClick={moveWindow} step={-1} disabled={disabledPrev} />

      {usersWindow.map(user => (
        <div className={styles.user} key={user.initials}>
          <div>{user.initials}</div>
          <div>{user.userMonthHours}</div>
        </div>
      ))}

      <Arrow show={showArrows} right onClick={moveWindow} step={1} disabled={disableNext} />
    </div>
  );

  function moveWindow(step) {
    setIndex(userIndex + step);
  }
}
