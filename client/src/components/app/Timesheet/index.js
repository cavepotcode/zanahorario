import React from 'react';
import CalendarHeader from './CalendarHeader';
import ProjectLine from './ProjectLine';
import styles from './styles.module.scss';
import ValueSlider from '../../ui/ValueSlider';
import { getMonthShortName } from '../../../utils/date';
import { lastMonday } from '../../../utils/date';
import Button from '../../ui/Button';

export default function Timesheet() {
  const [date, setDate] = React.useState(lastMonday);
  const [monthLabel, setMonthLabel] = React.useState(getMonthLabel(date));
  const [projects, setProjects] = React.useState([{ name: 'Cavepot' }]);

  return (
    <div className={styles.container}>
      <header>
        <ValueSlider onPrev={() => handleMonthChange(-1)} onNext={() => handleMonthChange(1)} value={monthLabel} />
        <ValueSlider onPrev={() => handleWeekChange(-7)} onNext={() => handleWeekChange(7)} value="WEEK" />
      </header>
      <section>
        <CalendarHeader startDate={date} />
        {projects.map(project => (
          <ProjectLine project={project} key={project.name} />
        ))}
      </section>
      <footer>
        <Button>Add Project</Button>
        <Button>Save</Button>
      </footer>
    </div>
  );

  function handleMonthChange(increment) {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + increment);
    setDate(newDate);
    setMonthLabel(getMonthLabel(newDate));
  }

  function handleWeekChange(increment) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + increment);
    setDate(newDate);
    setMonthLabel(getMonthLabel(newDate));
  }

  function getMonthLabel(date) {
    return `MONTH: ${getMonthShortName(date)}`;
  }
}
