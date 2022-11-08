import { Box } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Logo = ({ color, ...props }) => {
  const logoUrl = color === 'white' ? '/images/logo-white.png' : '/images/logo.png';
  const logoSymbolUrl = color === 'white' ? '/images/logo-white-symbol.png' : '/images/logo-symbol.png';

  return (
    <Box className="pointer" {...props}>
      <Hidden xsDown>
        <NavLink to="/">
          {/* <CmtImage src={logoUrl} alt="logo" /> */}
          <h3 style={{ color: 'White', fontWeight: 'bold' }}>Eastern Refinery Limited</h3>
        </NavLink>
      </Hidden>
      <Hidden smUp>
        <NavLink to="/">
          {/* <CmtImage src={logoSymbolUrl} alt="logo" /> */}
          <h3 style={{ color: 'White', fontWeight: 'bold' }}>Eastern Refinery Limited</h3>
        </NavLink>
      </Hidden>
    </Box>
  );
};

export default Logo;
