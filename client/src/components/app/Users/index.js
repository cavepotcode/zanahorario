import React, { useReducer } from 'react';
import styles from './styles.module.scss';
import ProjectsCarousel from '../../ui/Carousel';
import useSnackbar from '../../Snackbar/useSnackbar';
import { apiUrls } from '../../../urls';
import api from '../../../utils/api';
import classes from '../../../utils/classes';
import ValueSlider from '../../ui/ValueSlider';
import { getMonthShortName } from '../../../utils/date';

const selectedDate = new Date();
const label = getLabel(selectedDate);

const initialState = {
  error: null,
  loading: false,
  users: [],
  selectedDate,
  label
};

export default function Users() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { addNotification } = useSnackbar();

  React.useEffect(() => {
    const fetch = async () => {
      dispatch({ type: 'fetch_start' });
      const url = apiUrls.users.user(state.selectedDate);
      try {
        const response = await api.get(url);
        const users = response.data.map(item => ({
          ...item,
          lastTime: new Date(item.lastEntry).toLocaleDateString('es-UY')
        }));

        dispatch({ type: 'fetch_success', users });
      } catch (error) {
        dispatch({ type: 'fetch_failure', error });
        addNotification('There was an error getting the users. Try again later.');
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
        {state.users.map((item, index) => (
          <div
            className={classes(styles.user, index % 2 !== 0 && styles.odd)}
            key={item.user.id + state.selectedDate.toISOString()}
          >
            <div className={styles.title}>
              <span title={item.user.name}>{item.user.name}</span>
            </div>
            <div className={styles.selector}>
              <ProjectsCarousel
                entries={item.projectsHours.map(item => ({
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

function reducer(state, action) {
  switch (action.type) {
    case 'fetch_start':
      return { ...state, loading: true };
    case 'fetch_success':
      return { ...state, loading: false, users: action.users };
    case 'fetch_failure':
      return { ...state, loading: false, error: action.error, users: [] };
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
