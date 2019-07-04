import React, { useReducer } from 'react';
import styles from './styles.module.scss';
import UsersCarousel from './UsersCarousel';
import api from '../../../utils/api';
import classes from '../../../utils/classes';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';
import ValueSlider from '../../ui/ValueSlider';
import { getMonthShortName } from '../../../utils/date';

const selectedDate = new Date();
const label = getLabel(selectedDate);

const initialState = {
  loading: false,
  projects: [],
  selectedDate,
  label
};

export default function Projects() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { addNotification } = useSnackbar();

  React.useEffect(() => {
    const fetch = async () => {
      dispatch({ type: 'fetch_start' });
      const url = apiUrls.projectsTime(state.selectedDate.getMonth() + 1, state.selectedDate.getFullYear());
      try {
        const response = await api.get(url);
        const projects = response.data.map(item => ({
          ...item,
          lastTime: new Date(item.lastEntry).toLocaleDateString('es-UY')
        }));

        dispatch({ type: 'fetch_success', projects });
      } catch (error) {
        dispatch({ type: 'fetch_failure', error });
        addNotification('There was an error getting the projects. Try again later.');
      }
    };

    fetch();
  }, [state.selectedDate, addNotification]);

  return (
    <>
      <ValueSlider
        onPrev={() => dispatch({ type: 'decrement' })}
        onNext={() => dispatch({ type: 'increment' })}
        value={state.label}
      />
      <div className={classes(styles.container, state.loading && styles.loading)}>
        {state.projects.map((item, index) => (
          <div
            className={classes(styles.project, index % 2 !== 0 && styles.odd)}
            key={item.project.id + state.selectedDate.toISOString()}
          >
            <div className={styles.title}>
              <span title={item.project.name}>{item.project.name}</span>
            </div>
            <div className={styles.selector}>
              <UsersCarousel entries={item.usersHours} />
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

function reducer(state, action) {
  switch (action.type) {
    case 'fetch_start':
      return { ...state, loading: true };
    case 'fetch_success':
      return { ...state, loading: false, projects: action.projects };
    case 'fetch_failure':
      return { ...state, loading: false, error: action.error, projects: [] };
    case 'increment': {
      const newDate = new Date(state.selectedDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return { ...state, selectedDate: newDate, label: getLabel(newDate) };
    }
    case 'decrement': {
      const newDate = new Date(state.selectedDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return { ...state, selectedDate: newDate, label: getLabel(newDate) };
    }
    default:
      throw new Error();
  }
}

function getLabel(date) {
  const monthName = getMonthShortName(date);
  return `${monthName}, ${date.getFullYear()}`;
}
