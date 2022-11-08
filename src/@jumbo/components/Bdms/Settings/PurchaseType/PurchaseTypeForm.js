import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Controls from '@jumbo/controls/Controls';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

const initialFieldsValues = {
  id: 0,
  name: '',
  perVehicleQuantity: '',
  unitId: '',
  hasConversion: false,
  isActive: true
};

export default function PurchaseTypeForm(props) {
  const { savePurchaseType, recordForEdit } = props;
  const [units, setUnits] = useState([]); // For unit Dropdown
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('name' in fieldValues) temp.name = fieldValues.name ? '' : 'This fields is requird';
    if ('perVehicleQuantity' in fieldValues)
      temp.perVehicleQuantity = fieldValues.perVehicleQuantity ? '' : 'This fields is requird';
    if ('unitId' in fieldValues) temp.unitId = fieldValues.unitId ? '' : 'Please select a unit';
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

  useEffect(() => {
    async function getAllUnits() {
      await axios
        .get(urls_v1.unit.get_all)
        .then(res => {
          const body = res.data.data;
          setUnits(
            body.map(item => ({
              label: item.name,
              value: item.id
            }))
          );
        })
        .catch();
    }
    getAllUnits();
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
      savePurchaseType(values, resetForm);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Controls.Input
            name="name"
            label="Packaging Type Name"
            type="text"
            value={values.name}
            error={errors.name}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Controls.Input
            name="perVehicleQuantity"
            type="number"
            label="Per Vehicle Quantity"
            value={values.perVehicleQuantity}
            error={errors.perVehicleQuantity}
            onChange={handleInputChange}
            onFocus={e => {
              e.target.select();
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Controls.Select
            name="unitId"
            label="Select Unit"
            value={values.unitId}
            error={errors.unitId}
            onChange={handleInputChange}
            options={units}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Controls.Checkbox name="isActive" label="Is Active" value={values.isActive} onChange={handleInputChange} />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Controls.Checkbox
            name="hasConversion"
            label="Has Conversion?"
            value={values.hasConversion}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid container item xs={12} sm={12} md={4} lg={4} justify="flex-end">
          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default" onClick={resetForm} />
        </Grid>
      </Grid>
    </Form>
  );
}
