import { Checkbox as MuiChecbox, FormControl, FormControlLabel } from '@material-ui/core';
import React from 'react';

export default function CheckBox(props) {
  const { name, label, value, onChange } = props;
  const convertToDefaultEventParam = (name, value) => ({
    target: {
      name,
      value
    }
  });
  return (
    <FormControl>
      <FormControlLabel
        control={
          <MuiChecbox
            color="primary"
            checked={value}
            onChange={e => onChange(convertToDefaultEventParam(name, e.target.checked))}
          />
        }
        label={label}
      />
    </FormControl>
  );
}
