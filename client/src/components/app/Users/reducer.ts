import { getMonthShortName } from '../../../utils/date';

type State = {
  error: any;
  label: string;
  loading: boolean;
  selectedDate: Date;
  users: any[];
};

const selectedDate = new Date();
const label = getLabel(selectedDate);

export const initialState = {
  selectedDate,
  label,
  error: null,
  loading: false,
  users: []
};

export function reducer(state: State, action: any) {
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
    case 'reset_date': {
      const newDate = new Date(initialState.selectedDate);
      return { ...state, selectedDate: newDate, label: getLabel(newDate) };
    }
    default:
      throw new Error();
  }
}

function getLabel(date: Date) {
  const monthName = getMonthShortName(date);
  return `${monthName}, ${date.getFullYear()}`;
}
