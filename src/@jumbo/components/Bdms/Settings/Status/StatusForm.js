import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Controls from '@jumbo/controls/Controls';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

const initialFieldsValues = {
  id: 0,
  statusFor: '',
  name: '',
  publicName: '',
  isInternal: false,
  isPublic: false,
  isActive: true
};

export default function StatusForm(props) {
  const { saveStatus, recordForEdit } = props;
  const [statusFor, setStatusFor] = useState([]); // For StatusFor Dropdown

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('statusFor' in fieldValues) temp.statusFor = fieldValues.statusFor ? '' : 'This fields is requird';
    if ('name' in fieldValues) temp.name = fieldValues.name ? '' : 'This fields is requird';
    if ('publicName' in fieldValues) temp.publicName = fieldValues.publicName ? '' : 'This fields is requird';
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

  //  This will be used for StatusFor Dropdown
  useEffect(() => {
    async function getAllStatus() {
      await axios
        .get(urls_v1.utilities.get_status_for_list)
        .then(res => {
          const body = res.data.data;
          setStatusFor(
            body.map(item => ({
              label: item[1],
              value: item[0]
            }))
          );
        })
        .catch();
    }
    getAllStatus();
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
      saveStatus(values, resetForm);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="column" justify="center" alignItems="flex-start" spacing={3}>
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Controls.Select
              name="statusFor"
              label="Status For"
              value={values.statusFor}
              error={errors.statusFor}
              onChange={handleInputChange}
              options={statusFor}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Controls.Input
              name="name"
              label="Name"
              type="text"
              value={values.name}
              error={errors.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Controls.Input
              name="publicName"
              label="Public Name"
              type="text"
              value={values.publicName}
              error={errors.publicName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Controls.Checkbox
                name="isInternal"
                label="is Internal?"
                value={values.isInternal}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Controls.Checkbox name="isPublic" label="Is Public?" value={values.isPublic} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Controls.Checkbox name="isActive" label="Is Active" value={values.isActive} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </Grid>

        <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
