import React from 'react';
import { Field } from 'formik';
import grid from '../grid.module.scss';

type Props = {
  error?: string;
  name: string;
};

export default function HoursInput({ error, name }: Props) {
  return (
    <Field
      name={name}
      className={grid.cell}
      validate={validateHours}
      style={error ? { border: '1px solid red' } : null}
    />
  );

  // TODO: move to global validation
  function validateHours(val: string) {
    const isValid = /^\d*$/.test(val) && Number(val) <= 24;
    return isValid ? undefined : 'hours-exceeds-daily-limit';
  }
}
