import React, { useReducer } from 'react';
import styles from './styles.module.scss';
import { getMonthShortName } from '../../../utils/date';
import ValueSlider from '../../ui/ValueSlider';
import hotkeys from '../../../hotkeys';
import useSnackbar from '../../Snackbar/useSnackbar';
import { apiUrls } from '../../../urls';
import api from '../../../utils/api';
import Grid from '@material-ui/core/Grid';
import Summary from './Summary';
import Card from './Card';

const selectedDate = new Date();
const label = getLabel(selectedDate);

//TODO:
const initialState = {
  error: null,
  loading: false,
  projects: [],
  selectedDate,
  label
};

export default function Expenses() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { addNotification } = useSnackbar();

  React.useEffect(() => {
    //TODO:
    const fetch = async () => {
      dispatch({ type: 'fetch_start' });
      debugger;
      const url = apiUrls.expenses.expenses(state.selectedDate);
      try {
        const response = await api.get(url);
        debugger;
        const projects = response.data.map((item: any) => ({
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

  const prev = React.useCallback(() => dispatch({ type: 'decrement' }), []);
  const next = React.useCallback(() => dispatch({ type: 'increment' }), []);
  const reset = React.useCallback(() => dispatch({ type: 'reset_date' }), []);

  return (
    <>
      <ValueSlider
        onPrev={prev}
        onNext={next}
        onReset={reset}
        value={state.label}
        hotkeyPrev={hotkeys.project.prevMonth}
        hotkeyNext={hotkeys.project.nextMonth}
        hotkeyReset={hotkeys.project.today}
      />
      <div className={styles.container}>
        <Grid className={styles.summary} container={true} alignItems="center" justify="center">
          <Grid item={true} xs={12} md={6}>
            <Summary title="OUT" className={styles.out} isTotalOut={true} />
          </Grid>
          <Grid item={true} xs={12} md={6}>
            <Summary title="IN" className={styles.in} isTotalOut={false} />
          </Grid>
        </Grid>
        <Grid className={styles.categories} container={true} alignItems="center" justify="center">
          <Grid className={styles.item} item={true} xs={12} md={3}>
            <Card title="Salaries" />
          </Grid>
          <Grid className={styles.item} item={true} xs={12} md={3}>
            <Card title="Expenses File" />
          </Grid>
          <Grid className={styles.item} item={true} xs={12} md={3}>
            <Card title="Office" />
          </Grid>
          <Grid className={styles.item} item={true} xs={12} md={3}>
            <Card title="Maintenance" />
          </Grid>
          <Grid className={styles.item} item={true} xs={12} md={3}>
            <Card title="Food" />
          </Grid>
          <Grid className={styles.item} item={true} xs={12} md={3}>
            <Card title="Merchandising" />
          </Grid>
          <Grid className={styles.item} item={true} xs={12} md={3}>
            <Card title="Celebrations" />
          </Grid>
          <Grid className={styles.item} item={true} xs={12} md={3}>
            {/* <Card title="Sueldos" /> */}
          </Grid>
        </Grid>
      </div>
    </>
  );
}

function getLabel(date: Date) {
  const monthName = getMonthShortName(date);
  return `${monthName}, ${date.getFullYear()}`;
}

function reducer(state: any, action: any) {
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
    case 'reset_date': {
      const newDate = new Date(initialState.selectedDate);
      return { ...state, selectedDate: newDate, label: getLabel(newDate) };
    }
    default:
      throw new Error();
  }
}
