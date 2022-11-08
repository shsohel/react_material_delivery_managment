import GridContainer from '@jumbo/components/GridContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Button, CircularProgress, Grid, TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <div p={3}>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
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
  rootTab: {
    '& .MuiFormControl-root': {
      width: '80%',
      margin: theme.spacing(1)
    }
  }
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [systemSettings, setSystemSettings] = useState([]);
  const [liftingSate, setLiftingSate] = useState(null);
  const [liftingScheduleValue, setLiftingScheduleValue] = useState('');
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const getAllSystemSettings = async () => {
    await axios.get(`${urls_v1.systemSettings.get_all}`).then(({ data }) => {
      const body = data.data;
      setSystemSettings(body);
      setLiftingSate(body.find(item => item.identifier === 'LIFTING_SCHEDULE_TO'));
      setIsPageLoaded(true);
    });
  };

  useEffect(() => {
    getAllSystemSettings();
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      identifier: liftingSate.identifier,
      name: liftingSate.name,
      valueType: liftingSate.valueType,
      value: liftingScheduleValue,
      isActive: liftingSate.isActive
    };

    await axios.post(`${urls_v1.systemSettings.post}`, data).then(({ data }) => {});
  };

  return (
    <GridContainer className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}>
        {systemSettings.map(item => (
          <Tab key={item.id} label={item.name} {...a11yProps(0)} />
        ))}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container>
          <Grid item xs>
            <Grid container item xs={12} sm={12} md={12} lg={12} spacing={5}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  id="standard-basic"
                  label="Standard"
                  value={liftingScheduleValue}
                  name="value"
                  onChange={e => {
                    setLiftingScheduleValue(e.target.value);
                  }}
                />
              </Grid>
              <Button onClick={handleSubmit}>Submit</Button>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        kjksfjksjfk
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </GridContainer>
  );
}
