import { TextField } from '@material-ui/core';
import React from 'react';

export default function Input(props) {
  const { type, name, label, value, error = null, onChange, ...other } = props;
  const convertToDefaultEventParam = (name, value) => ({
    target: {
      name,
      value
    }
  });

  return (
    <TextField
      size="small"
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={e => onChange(convertToDefaultEventParam(name, type === 'number' ? Number(e.target.value) : e.target.value))}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
}
