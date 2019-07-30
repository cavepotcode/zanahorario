import React from 'react';
import styles from './styles.module.scss';
import ProjectsCarousel from '../../ui/Carousel';
import classes from '../../../utils/classes';
import ValueSlider, { useValueSlider } from '../../ui/ValueSlider';
import hotkeys from '../../../hotkeys';
import useUsers from './useUsers';

export default function Users() {
  const { selectedDate, label, prevMonth, nextMonth, resetDate } = useValueSlider();
  const { users, loading } = useUsers(selectedDate);

  const userHotkeys = {
    prev: { key: hotkeys.users.prev, handler: prevMonth },
    next: { key: hotkeys.users.next, handler: nextMonth },
    reset: { key: hotkeys.users.today, handler: resetDate }
  };

  return (
    <>
      <ValueSlider hotkeys={userHotkeys} value={label} />
      <div className={classes(styles.container, loading && styles.loading)}>
        {users.map((item: any, index: number) => (
          <div
            className={classes(styles.user, index % 2 !== 0 && styles.odd)}
            key={item.user.id + selectedDate.toISOString()}
          >
            <div className={styles.title}>
              <span title={item.user.name}>{item.user.name}</span>
            </div>
            <div className={styles.selector}>
              <ProjectsCarousel
                entries={item.projectsHours.map((item: any) => ({
                  id: item.project.id,
                  name: item.project.name,
                  hours: item.hours
                }))}
                max={2}
              />
            </div>
            <div className={styles.info}>
              <span>LAST DATE: {item.lastTime}</span>
              <span>MONTH HOURS: {item.monthHours}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
