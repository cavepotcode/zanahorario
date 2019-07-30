import React from 'react';
import styles from './styles.module.scss';
import UsersCarousel from '../../ui/Carousel';
import classes from '../../../utils/classes';
import ValueSlider, { useValueSlider } from '../../ui/ValueSlider';
import hotkeys from '../../../hotkeys';
import useProjects from './useProjects';

const today = new Date();
const initialDate = new Date(today.getFullYear(), today.getMonth(), 1);

export default function Projects() {
  const { selectedDate, label, prevMonth, nextMonth, resetDate } = useValueSlider(initialDate);
  const { loading, projects } = useProjects(selectedDate);

  const projectHotkeys = {
    prev: { key: hotkeys.project.prevMonth, handler: prevMonth },
    next: { key: hotkeys.project.nextMonth, handler: nextMonth },
    reset: { key: hotkeys.project.today, handler: resetDate }
  };
  return (
    <>
      <ValueSlider value={label} hotkeys={projectHotkeys} />
      <div className={classes(styles.container, loading && styles.loading)}>
        {projects.map((item: any, index: number) => (
          <div
            className={classes(styles.project, index % 2 !== 0 && styles.odd)}
            key={item.project.id + selectedDate.toISOString()}
          >
            <div className={styles.title}>
              <span title={item.project.name}>{item.project.name}</span>
            </div>
            <div className={styles.selector}>
              <UsersCarousel
                entries={item.usersHours.map((item: any) => ({
                  id: item.user.id,
                  name: item.user.initials,
                  hours: item.hours
                }))}
                max={3}
              />
            </div>
            <div className={styles.info}>
              <span>LAST DATE: {item.lastTime}</span>
              <span>MONTH HOURS: {item.monthHours}</span>
              <span>TOTAL HOURS: {item.total}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
