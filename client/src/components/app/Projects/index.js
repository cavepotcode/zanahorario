import React, { useReducer } from 'react';
import styles from './styles.module.scss';
import UsersCarousel from './UsersCarousel';
import api from '../../../utils/api';
import classes from '../../../utils/classes';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';

const initialState = {
  loading: false,
  projects: [],
  month: new Date().getMonth()
};

export default function Projects() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { addNotification } = useSnackbar();

  React.useEffect(() => {
    const fetch = async () => {
      dispatch({ type: 'fetch_start' });
      const url = apiUrls.projects(state.month, 2019);
      try {
        const response = await api.get(url);
        const projects = response.data.map(item => ({
          ...item,
          lastTime: new Date(item.lastTime).toLocaleDateString('es-UY')
        }));

        dispatch({ type: 'fetch_success', projects });
      } catch (err) {
        dispatch({ type: 'fetch_failure' });
        addNotification('There was an error getting the projects. Try again later.');
      }
    };

    fetch();
  }, [state.month, addNotification]);

  return (
    <>
      <div>
        <button onClick={() => dispatch({ type: 'decrement' })}>&lt;</button>
        move
        <button onClick={() => dispatch({ type: 'increment' })}>&gt;</button>
      </div>
      <div className={classes(styles.container, state.loading && styles.loading)}>
        {state.projects.map((item, index) => (
          <div className={classes(styles.project, index % 2 !== 0 && styles.odd)} key={item.project.id + state.month}>
            <div className={styles.title}>
              <span>{item.project.name}</span>
            </div>
            <div className={styles.selector}>
              <UsersCarousel entries={item.usersHoursByProject} />
            </div>
            <div className={styles.info}>
              <span>LAST DATE: {item.lastTime}</span>
              <span>MONTH HOURS: {item.monthHours}</span>
              <span>TOTAL HOURS: {item.totalHours}</span>
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
      return { ...state, loading: false, projects: [] };
    case 'increment':
      return { ...state, month: state.month + 1 };
    case 'decrement':
      return { ...state, month: state.month - 1 };
    default:
      throw new Error();
  }
}
