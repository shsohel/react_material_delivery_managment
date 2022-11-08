import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { productGrades } from '@jumbo/constants/PermissionsType';
import { AddIcon, RemoveIcon } from '@jumbo/controls/ActionButtons';
import { Box, Button, FormControlLabel, Grid, IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircleOutline } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  mainDiv: {
    minWidth: '900px'
  },
  gradeTitle: {
    background: '#A9A9A9',
    color: 'white'
  },
  formControl: {
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
  },
  selectEmpty: {
    marginTop: theme.spacing(6)
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  textField: {
    margin: theme.spacing(6),
    width: '90%'
  },
  checkBoxControl: {
    margin: theme.spacing(6),
    width: '90%',
    paddingLeft: theme.spacing(2)
  },
  addRemoveAction: {
    margin: theme.spacing(6),
    width: '90%',
    paddingLeft: theme.spacing(2)
  }
}));

export default function GradeForm(props) {
  const classes = useStyles();
  const data = props.recordForEdit;
  const { closePopup } = props;

  const [gradeForEdit, setGradeForEdit] = useState([]);
  const [idsForRemove, setIdsForRemove] = useState([]);

  const { userPermission } = useSelector(({ auth }) => auth);

  async function getAllGrades() {
    await axios
      .get(`${urls_v1.productGrade.get_by_productId}/${data.id}`)
      .then(res => {
        const body = res.data.data;
        setGradeForEdit(
          body.map(item => ({
            fieldId: uuidv4(),
            id: item.id,
            productId: data.id,
            nameEN: item.nameEN,
            detailsEN: item.detailsEN,
            key: item.key,
            isActive: item.isActive
          }))
        );
      })
      .catch();
  }
  useEffect(() => {
    getAllGrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (fieldId, e) => {
    const newInputField = gradeForEdit.map(item => {
      if (fieldId === item.fieldId) {
        item[e.target.name] = e.target.value;
      }
      return item;
    });
    setGradeForEdit(newInputField);
  };

  const handleAddFields = () => {
    setGradeForEdit([...gradeForEdit, { fieldId: uuidv4(), productId: data.id, nameEN: '', detailsEN: '', isActive: true }]);
  };
  const handleRemoveFields = fieldId => {
    const values = [...gradeForEdit];
    const gradevalues = values.splice(
      values.findIndex(value => value.fieldId === fieldId),
      1
    );
    setGradeForEdit(values);
    const id = gradevalues[0].id;
    if (id) {
      setIdsForRemove([...idsForRemove, id]);
    }
  };
  const onDelete = () => {
    if (idsForRemove.length > 0) {
      axios.delete(`${urls_v1.productGrade.delete_all}`, { data: { gradeIds: idsForRemove } }).then(res => console.log(res));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const obj = {
      productGrades: gradeForEdit
    };
    axios
      .put(`${urls_v1.productGrade.put}`, obj)
      .then(({ data }) => {
        if (data.succeeded) {
          NotificationManager.success(data.message);
        } else {
          NotificationManager.warning(data.message);
        }
      })
      .catch(({ response }) => {
        NotificationManager.warning(response.data.Message);
      });
    onDelete();
    closePopup();
  };

  return (
    <Grid container className={classes.mainDiv} justify="center">
      <Grid container className={classes.gradeTitle} item justify="center">
        <h2> Assign Grade for the Product</h2>
      </Grid>
      {gradeForEdit.length === 0 ? (
        <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
          {userPermission?.includes(productGrades.CREATE) && (
            <FormControlLabel
              control={
                <IconButton
                  disabled={!userPermission?.includes(productGrades.CREATE)}
                  style={{ color: '#4CAF50' }}
                  onClick={handleAddFields}>
                  <AddCircleOutline />
                </IconButton>
              }
              label="Add a Grade?"
            />
          )}
        </Grid>
      ) : null}

      <Grid container item xs={12} sm={12} md={12} lg={12}>
        {gradeForEdit.map((item, index) => (
          <Grid container item xs={12} sm={12} md={12} lg={12} key={item.fieldId}>
            <Grid item xs={4} sm={4} md={5} lg={5}>
              <TextField
                className={classes.textField}
                size="small"
                disabled={item.id && !userPermission?.includes(productGrades.EDIT)}
                variant="outlined"
                name="nameEN"
                label="Grade Name"
                value={item.nameEN}
                onChange={e => {
                  handleInputChange(item.fieldId, e);
                }}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={5} lg={5}>
              <TextField
                className={classes.textField}
                size="small"
                disabled={item.id && !userPermission?.includes(productGrades.EDIT)}
                name="detailsEN"
                label="Details"
                variant="outlined"
                value={item.detailsEN}
                onChange={e => {
                  handleInputChange(item.fieldId, e);
                }}
              />
            </Grid>
            <Grid container item xs={4} sm={4} md={2} lg={2}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Box className={classes.addRemoveAction}>
                  <RemoveIcon
                    title="Delete Grade"
                    placement="top"
                    disabled={!userPermission?.includes(productGrades.DELETE) && item.id}
                    onClick={() => {
                      handleRemoveFields(item.fieldId);
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                {userPermission?.includes(productGrades.CREATE) && (
                  <Box className={classes.addRemoveAction}>
                    {index === gradeForEdit.length - 1 ? (
                      <AddIcon title="Add Grade" placement="top" onClick={handleAddFields} />
                    ) : null}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        ))}
        <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
          <Button size="small" onClick={handleSubmit} variant="outlined" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
