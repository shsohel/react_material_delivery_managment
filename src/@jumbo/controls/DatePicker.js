import { KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';

export default function DatePicker(props) {
  const { name, label, value, onChange, ...others } = props;
  const convertToDefaultEventParam = (name, value) => ({
    target: {
      name,
      value
    }
  });
  return (
    <KeyboardDatePicker
      size="small"
      inputVariant="outlined"
      format="DD-MMM-yyyy"
      name={name}
      label={label}
      value={value}
      onChange={date => onChange(convertToDefaultEventParam(name, date))}
      {...others}
    />
  );
}
