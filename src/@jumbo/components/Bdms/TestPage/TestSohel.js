import { Button } from '@material-ui/core';
import React from 'react';

const TestSohel = () => {
  const { REACT_APP_REPORT_URL } = process.env;

  let arr = ['Jack', 'John', 'James'];
  const printMe = () => {
    const printData = (document.getElementById('arrPrint').innerHTML = arr);
  };

  const handlePrint = async () => {
    //await window.open(`${REACT_APP_REPORT_URL}/`, '_blank');
    window.open('http://www.java2s.com/');
    window.open('http://www.java2s.com/');
    // for (let index = 0; index < 2; index++) {
    //   window.open('http://www.java2s.com/');
    // }
  };
  const handlePrintexit = async () => {
    await window.open(`${REACT_APP_REPORT_URL}/`, '_blank');
  };

  return (
    <div id="arrPrint">
      <Button
        onClick={() => {
          handlePrint();
        }}>
        Print
      </Button>
    </div>
  );
};

export default TestSohel;
