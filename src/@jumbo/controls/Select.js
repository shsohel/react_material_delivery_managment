import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing(6),
    width: '90%'
  }
}));

export default function Select(props) {
  const classes = useStyles();
  const { name, label, value, error = null, onChange, options, ...others } = props;
  return (
    <>
      <TextField
        className={classes.textField}
        id="standard-select-Unit"
        select
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        disabled={props.disabled}
        variant="outlined"
        size="small"
        {...(error && { error: true, helperText: error })}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
