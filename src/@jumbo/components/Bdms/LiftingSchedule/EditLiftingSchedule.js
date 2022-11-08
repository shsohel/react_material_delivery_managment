import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import Moment from 'moment';
import React, { useState } from 'react';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  circularProgressRoot: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#018786'
    },
    '& tbody td': {
      fontWeight: 'lighter'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    }
  },
  dateTime: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary
  },
  textField: {
    margin: theme.spacing(1),
    width: '80%',
    fontSize: '5px',
    fontWeight: 'bold'
  },
  dividerColor: {
    backgroundColor: '#1D4354'
  },
  formControl: {
    width: '100%',
    padding: theme.spacing(0)
  }
}));

export default function EditLiftingSchedule(props) {
  const classes = useStyles();
  const { closePopup } = props;
  const [recordForEdit, setrecordForEdit] = useState({
    id: props.recordForEdit.id,
    isComplete: props.recordForEdit.isComplete,
    isDeleted: props.recordForEdit.isDeleted,
    isRejected: props.recordForEdit.isRejected,
    key: props.recordForEdit.key,

    liftingQuantity: props.recordForEdit.liftingQuantity,
    liftingQuantityDue: props.recordForEdit.liftingQuantityDue,
    liftingDateAndTime: props.recordForEdit.liftingDateAndTime,
    numberOfDrum: props.recordForEdit.numberOfDrum,
    numberOfDrumDue: props.recordForEdit.numberOfDrumDue,
    orderDetailsId: props.recordForEdit.orderDetailsId,
    productGradeId: props.recordForEdit.productGradeId,
    productGradeName: props.recordForEdit.productGradeName,
    productName: props.recordForEdit.productName,
    purchaseTypeId: props.recordForEdit.purchaseTypeId,
    purchaseTypeName: props.recordForEdit.purchaseTypeName,
    statusId: props.recordForEdit.statusId,
    unitId: props.recordForEdit.unitId,
    unitName: props.recordForEdit.unitName,

    conversionRate: props.recordForEdit.conversionRate
  });

  const [selectedDate, handleDateChange] = useState(new Date(recordForEdit.liftingDateAndTime));

  const handleSubmit = event => {
    event.preventDefault();
    const body = {
      id: recordForEdit.id,
      key: recordForEdit.key,
      liftingDate: Moment(selectedDate).format('yyyy-MM-DD hh:mm:ss'),
      numberOfDrum: recordForEdit.numberOfDrum,
      liftingQuantity: recordForEdit.liftingQuantity
    };
    axios.put(`${urls_v1.liftingSchedule.put}/${recordForEdit.key}`, body).then(({ data }) => {
      if (data.succeeded) {
        closePopup();
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container item xs={12} sm={12} md={12} lg={12} spacing={5}>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              <Typography style={{ paddingRight: '20px' }}>
                Product Info : {recordForEdit.productName}/{recordForEdit.productGradeName}
              </Typography>
              <Typography style={{ paddingRight: '20px' }}>
                Remaining No. of Drum : {recordForEdit.numberOfDrumDue}
              </Typography>
              <Typography style={{ paddingRight: '20px' }}>
                Remaining Quantity : {recordForEdit.liftingQuantityDue}
              </Typography>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <h3>Lifting Date : </h3>
              </Grid>
              <Grid item xs={8} sm={8} md={8} lg={8}>
                <DateTimePicker
                  className={classes.textField}
                  disablePast
                  format="DD-MM-yyyy hh:mm a"
                  name="requestDateTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  showTodayButton
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <h3>Drum : </h3>
              </Grid>
              <Grid item xs={8} sm={8} md={8} lg={8}>
                <TextField
                  className={classes.textField}
                  disabled={recordForEdit.numberOfDrum === 0}
                  type="number"
                  name="liftingDrum"
                  variant="outlined"
                  size="small"
                  value={recordForEdit.numberOfDrum}
                  inputProps={{ min: 0, max: recordForEdit.numberOfDrumDue }}
                  onChange={e => {
                    setrecordForEdit({
                      ...recordForEdit,
                      numberOfDrum: e.target.value,
                      liftingQuantity: Number((recordForEdit.conversionRate * e.target.value).toFixed(2))
                    });
                  }}
                  onFocus={e => {
                    e.target.select();
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <h3>Qty : </h3>
              </Grid>
              <Grid item xs={8} sm={8} md={8} lg={8}>
                <TextField
                  className={classes.textField}
                  disabled={recordForEdit.numberOfDrum !== 0}
                  type="number"
                  name="liftingQuantity"
                  value={recordForEdit.liftingQuantity}
                  inputProps={{ min: 0, max: recordForEdit.liftingQuantityDue }}
                  onChange={e => {
                    setrecordForEdit({ ...recordForEdit, liftingQuantity: e.target.value });
                  }}
                  onFocus={e => {
                    e.target.select();
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <Button size="small" type="submit" onClick={handleSubmit} variant="outlined" color="primary">
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
