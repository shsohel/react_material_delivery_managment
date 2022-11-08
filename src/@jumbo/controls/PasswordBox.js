import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';

export default function PassordBox(props) {
  const { showPassword, setShowPassword, label, name, value, onChange, error = null, ...others } = props;

  const convertToDefaultEventParam = (name, value) => ({
    target: {
      name,
      value
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  return (
    <>
      <TextField
        size="small"
        variant="outlined"
        type={showPassword ? 'text' : 'password'}
        label={label}
        name={name}
        value={value}
        onChange={e => onChange(convertToDefaultEventParam(name, e.target.value))}
        {...others}
        {...(error && { error: true, helperText: error })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </>
  );
}

PassordBox.propTypes = {
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
