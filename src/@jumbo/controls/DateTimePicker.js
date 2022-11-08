import { KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';

export default function DateTimePicker(props) {
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
      //   type="datetime-local"
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      {...others}
    />
    // <TextField id="date" size="small" label="label" type="datetime-local" value={value} onChange={onChange} {...others} />
  );
}
