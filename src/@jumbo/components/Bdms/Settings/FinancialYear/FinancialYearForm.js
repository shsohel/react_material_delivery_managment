import Controls from '@jumbo/controls/Controls';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(3),
      width: '25ch'
    }
  },
  alert: {
    '& > *': {
      marginBottom: theme.spacing(3),
      '&:not(:last-child)': {
        marginRight: theme.spacing(3)
      }
    }
  },
  financialYear: {
    margin: theme.spacing(2),
    fontWeight: 'bold',
    border: 'solid #C6C6C6 2px',
    width: '79%',
    borderRadius: '5%',
    paddingBlock: theme.spacing(2),
    '&.MuiTypography-body1': {
      paddingLeft: '10px'
    }
  }
}));

const initialFieldsValues = {
  key: '',
  id: '',
  startDate: new Date(),
  endDate: new Date(),
  isActive: true
};

export default function FinancialYearForm(props) {
  const classes = useStyles();
  const { saveFinancialYear, recordForEdit } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('startDate' in fieldValues) temp.startDate = fieldValues.startDate ? '' : 'This fields is requird';
    if ('endDate' in fieldValues) temp.endDate = fieldValues.endDate ? '' : 'This fields is requird';
    setErrors({
      ...temp
    });
    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };

  const { values, setValues, errors, setErrors, resetForm, handleInputChange } = useForm(
    initialFieldsValues,
    true,
    validate
  );

  const handleFromDateChange = date => {
    setValues({
      ...values,
      startDate: date.target.value
    });
  };
  const handleToDateChange = date => {
    setValues({
      ...values,
      endDate: date.target.value
    });
  };

  const handleSubmit = event => {
    const body = {
      key: values.key,
      id: values.id,
      financialYearName:
        new Date(values.startDate).getFullYear().toString() + '-' + new Date(values.endDate).getFullYear().toString(),
      startDate: values.startDate,
      endDate: values.endDate,
      isActive: values.isActive
    };
    event.preventDefault();
    if (validate()) {
      saveFinancialYear(body, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit
      });
    }
  }, [recordForEdit, setValues]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="column" justify="center" alignItems="flex-start" spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Typography className={classes.financialYear} component="div">
            Financial Year:{' '}
            {new Date(values.startDate).getFullYear().toString() + '-' + new Date(values.endDate).getFullYear().toString()}
          </Typography>
          <Controls.DatePicker
            name="startDate"
            type="date"
            label="Start Date"
            value={values.startDate}
            error={errors.startDate}
            onChange={handleFromDateChange}
          />
          <Controls.DatePicker
            name="endDate"
            type="date"
            label="End Date"
            value={values.endDate}
            error={errors.endDate}
            onChange={handleToDateChange}
          />
          <Controls.Checkbox name="isActive" label="Is Active" value={values.isActive} onChange={handleInputChange} />

          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default" onClick={resetForm} />
        </Grid>
      </Grid>
    </Form>
  );
}
