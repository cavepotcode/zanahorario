import React, { useState } from 'react';
import styles from './styles.module.scss';
import UsersCarousel from '../../ui/Carousel';
import classes from '../../../utils/classes';
import ValueSlider from '../../ui/ValueSlider';
import { getMonthShortName } from '../../../utils/date';
import hotkeys from '../../../hotkeys';
import useProjects from './useProjects';

const today = new Date();
const initialDate = new Date(today.getFullYear(), today.getMonth(), 1);
const initialLabel = getLabel(initialDate);

export default function Projects() {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [label, setLabel] = useState(initialLabel);
  const { loading, projects } = useProjects(selectedDate);

  const prev = React.useCallback(decrement, [selectedDate]);
  const next = React.useCallback(increment, [selectedDate]);
  const reset = React.useCallback(resetDate, [selectedDate]);
  return (
    <>
      <ValueSlider
        onPrev={prev}
        onNext={next}
        onReset={reset}
        value={label}
        hotkeyPrev={hotkeys.project.prevMonth}
        hotkeyNext={hotkeys.project.nextMonth}
        hotkeyReset={hotkeys.project.today}
      />
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

  function increment() {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
    setLabel(getLabel(newDate));
  }

  function decrement() {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
    setLabel(getLabel(newDate));
  }

  function resetDate() {
    const newDate = new Date(initialDate);
    setSelectedDate(newDate);
    setLabel(getLabel(newDate));
  }
}

function getLabel(date: Date) {
  const monthName = getMonthShortName(date);
  return `${monthName}, ${date.getFullYear()}`;
}
