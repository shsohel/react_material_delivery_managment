import Controls from '@jumbo/controls/Controls';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Grid } from '@material-ui/core';
import React, { useEffect } from 'react';

const initialFieldsValues = {
  id: 0,
  name: '',
  shortCode: '',
  isActive: true
};

export default function UnitForm(props) {
  const { saveUnit, recordForEdit } = props;
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('name' in fieldValues) temp.name = fieldValues.name ? '' : 'This fields is requird';
    if ('shortCode' in fieldValues) temp.shortCode = fieldValues.shortCode ? '' : 'This fields is requird';
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

  const handleSubmit = event => {
    event.preventDefault();
    if (validate()) {
      saveUnit(values, resetForm);
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
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="name"
            label="Unit Name"
            value={values.name}
            error={errors.name}
            onChange={handleInputChange}
          />
          <Controls.Input
            name="shortCode"
            label="Short Code"
            value={values.shortCode}
            error={errors.shortCode}
            onChange={handleInputChange}
          />
          <Controls.Checkbox name="isActive" label="Is Active" value={values.isActive} onChange={handleInputChange} />

          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
