import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Button, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing(6),
    width: '90%'
  }
}));

export default function OrderConfirmedForm(props) {
  const classes = useStyles();
  const { recordForEdit, closePopup } = props;
  const [orderConfirm, setOrderConfirm] = useState({
    ...orderConfirm,
    orderId: recordForEdit.orderId,
    status: recordForEdit.status,
    remarks: ''
  });
  const handleSubmit = () => {
    axios
      .put(`${urls_v1.order.put_order_confirmation}`, orderConfirm)
      .then(({ data }) => {
        if (data.succeeded) {
          closePopup();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <Grid container justify="center" spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TextField
          className={classes.textField}
          variant="outlined"
          margin="normal"
          label={`Please write a remark for ${recordForEdit.status}`}
          value={recordForEdit.remarks}
          name="remarks"
          onChange={e => {
            setOrderConfirm({ ...orderConfirm, remarks: e.target.value });
          }}
        />
      </Grid>
      <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            handleSubmit();
          }}>
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}
