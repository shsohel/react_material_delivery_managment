import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Button, TextField } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import React, { useState } from 'react';
import axios from '../../../../../../services/auth/jwt/config';

export default function EditEntryPermit(props) {
  const [recordForEdit, setrecordForEdit] = useState(props.recordForEdit);
  const [selectedDate, handleDateChange] = useState(new Date(recordForEdit.entryDate));

  const handleSubmit = event => {
    event.preventDefault();
    axios.put(`${urls_v1.entryPermit.put}/${recordForEdit.key}`, recordForEdit).then(({ data }) => {});
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h3>Permit Number</h3>
        <span>{recordForEdit.permitNumber}</span>
      </div>
      <div>
        <h3>Lifting Date</h3>
        <DateTimePicker
          disablePast
          format="DD-MM-yyyy hh:mm a"
          name="requestDateTime"
          value={selectedDate}
          onChange={handleDateChange}
          showTodayButton
        />
      </div>
      <div>
        <h3>Drum</h3>
        <TextField
          type="number"
          name="liftingDrum"
          value={recordForEdit.numberOfDrum}
          //inputProps={{ min: 0, max: recordForEdit.numberOfDrumDue }}
          onChange={e => {
            setrecordForEdit({ ...recordForEdit, numberOfDrum: e.target.value });
          }}
        />
      </div>
      <div>
        <h3>Qty</h3>
        <TextField
          type="number"
          name="liftingQuantity"
          value={recordForEdit.transportQuantity}
          //inputProps={{ min: 0, max: recordForEdit.liftingQuantityDue }}
          onChange={e => {
            setrecordForEdit({ ...recordForEdit, transportQuantity: e.target.value });
          }}
        />
      </div>
      <div>
        <h3>Representative Name</h3>
        <TextField
          name="representativeName"
          value={recordForEdit.representativeName}
          //inputProps={{ min: 0, max: recordForEdit.liftingQuantityDue }}
          onChange={e => {
            setrecordForEdit({ ...recordForEdit, representativeName: e.target.value });
          }}
        />
      </div>
      <div>
        <h3>Representative Contact</h3>
        <TextField
          name="representativeName"
          value={recordForEdit.representativeContact}
          //inputProps={{ min: 0, max: recordForEdit.liftingQuantityDue }}
          onChange={e => {
            setrecordForEdit({ ...recordForEdit, representativeContact: e.target.value });
          }}
        />
      </div>
      <div>
        <h3>Transport Number</h3>
        <TextField
          name="liftingQuantity"
          value={recordForEdit.transportNumber}
          //inputProps={{ min: 0, max: recordForEdit.liftingQuantityDue }}
          onChange={e => {
            setrecordForEdit({ ...recordForEdit, transportNumber: e.target.value });
          }}
        />
      </div>
      <div>
        <h3>Driver Name</h3>
        <TextField
          name="representativeName"
          value={recordForEdit.driverName}
          //inputProps={{ min: 0, max: recordForEdit.liftingQuantityDue }}
          onChange={e => {
            setrecordForEdit({ ...recordForEdit, driverName: e.target.value });
          }}
        />
      </div>
      <div>
        <h3>Licence Number</h3>
        <TextField
          name="representativeName"
          value={recordForEdit.licenceNumber}
          //inputProps={{ min: 0, max: recordForEdit.liftingQuantityDue }}
          onChange={e => {
            setrecordForEdit({ ...recordForEdit, licenceNumber: e.target.value });
          }}
        />
      </div>
      <Button type="submit" variant="outlined" color="primary">
        Primary{' '}
      </Button>
    </form>
  );
}
