import React, { useReducer } from 'react';
import { getMonthShortName, lastMonday } from '../../../utils/date';

export function useValueSlider(initialDate = new Date(), isDisabled: () => boolean = () => false) {
  const [state, dispatch] = useReducer(reducer, {
    label: getLabel(initialDate),
    selectedDate: initialDate
  });

  const prevMonth = React.useCallback(() => dispatch({ type: 'set_month', increment: -1, isDisabled }), [isDisabled]);
  const nextMonth = React.useCallback(() => dispatch({ type: 'set_month', increment: 1, isDisabled }), [isDisabled]);
  const prevMonthMonday = React.useCallback(() => dispatch({ type: 'set_month_monday', increment: -1, isDisabled }), [isDisabled]);
  const nextMonthMonday = React.useCallback(() => dispatch({ type: 'set_month_monday', increment: 1, isDisabled }), [isDisabled]);
  const prevWeek = React.useCallback(() => dispatch({ type: 'set_week', increment: -7, isDisabled }), [isDisabled]);
  const nextWeek = React.useCallback(() => dispatch({ type: 'set_week', increment: 7, isDisabled }), [isDisabled]);
  const resetDate = React.useCallback(() => dispatch({ type: 'reset_date', initialDate, isDisabled }), [initialDate, isDisabled]);

  return { ...state, prevMonthMonday, nextMonthMonday, prevMonth, nextMonth, prevWeek, nextWeek, resetDate };
}

type State = {
  selectedDate: Date;
  label: string;
};

type Action = {
  type: 'set_month' | 'set_month_monday' | 'set_week' | 'reset_date';
  [action: string]: any;
};

function reducer(state: State, action: Action) {
  if (action.isDisabled && action.isDisabled()) {
    return { ...state };
  }

  switch (action.type) {
    case 'set_month': {
      const newDate = new Date(state.selectedDate);
      newDate.setMonth(newDate.getMonth() + action.increment);
      return { ...state, selectedDate: newDate, label: getLabel(newDate) };
    }
    case 'set_month_monday': {
      const newDate = new Date(state.selectedDate);
      newDate.setMonth(newDate.getMonth() + action.increment);
      return { ...state, selectedDate: lastMonday(newDate), label: getLabel(newDate) };
    }
    case 'set_week': {
      const newDate = new Date(state.selectedDate);
      newDate.setDate(newDate.getDate() + action.increment);
      return { ...state, selectedDate: newDate, label: getLabel(newDate) };
    }
    case 'reset_date': {
      const newDate = new Date(action.initialDate);
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
