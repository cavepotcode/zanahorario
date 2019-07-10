import React from 'react';
import { asField, BasicText } from 'informed';
import grid from '../grid.module.scss';

function Input({ fieldState, ...props }) {
  return (
    <BasicText
      className={grid.cell}
      fieldState={fieldState}
      {...props}
      style={fieldState.error ? { border: '1px solid red' } : null}
    />
  );
}

const InputWithValidation = asField(Input);

export default function HoursInput(props) {
  return <InputWithValidation validate={validateHours} validateOnBlur {...props} />;

  function validateHours(val = '') {
    const isValid = /^\d*$/.test(val) && Number(val) <= 24;
    return isValid ? undefined : 'hours-exceeds-daily-limit';
  }
}
