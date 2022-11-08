import GridContainer from '@jumbo/components/GridContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Controls from '@jumbo/controls/Controls';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
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
  inputField: {
    width: '150%'
  }
}));

const initialFieldsValues = {
  id: 0,
  processType: '',
  userId: ''
};

export default function ApprovalProcessForm(props) {
  const classes = useStyles();
  const { saveApprovalProcess, recordForEdit } = props;
  const [processType, setProcessType] = useState([]); // For StatusFor Dropdown
  const [users, setUsers] = useState([]);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    //    if ('processType' in fieldValues) temp.processType = fieldValues.processType ? '' : 'This fields is requird';
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

  //  This will be used for StatusFor Dropdown /api/Account/users
  async function getAllApprovalProcess() {
    await axios
      .get(`${urls_v1.utilities.get_approval_process_type_list}`)
      .then(res => {
        const body = res.data.data;
        setProcessType(
          body.map(item => ({
            label: item[1],
            value: item[0]
          }))
        );
      })
      .catch();
  }
  async function getAllUser() {
    await axios
      .get(`${urls_v1.account.users.get_all_users}`)
      .then(res => {
        const body = res.data;
        setUsers(
          body.map(item => ({
            label: item.fullName,
            value: item.id
          }))
        );
      })
      .catch();
  }
  useEffect(() => {
    getAllApprovalProcess();
    getAllUser();
  }, []);

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit
      });
    }
  }, [recordForEdit, setValues]);

  const handleSubmit = event => {
    event.preventDefault();
    if (validate()) {
      saveApprovalProcess(values, resetForm);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <GridContainer>
        <Grid container item xs={12} sm={12} md={12} lg={12} justify="space-around">
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Controls.Select
              className={classes.inputField}
              margin="normal"
              name="processType"
              label="Approval Process Type"
              value={values.processType}
              error={errors.processType}
              onChange={handleInputChange}
              options={processType}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Controls.Select
              className={classes.inputField}
              margin="normal"
              name="userId"
              label="User"
              value={values.userId}
              error={errors.userId}
              onChange={handleInputChange}
              options={users}
            />
          </Grid>
        </Grid>

        <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
      </GridContainer>
    </Form>
  );
}
