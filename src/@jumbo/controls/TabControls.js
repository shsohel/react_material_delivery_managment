import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  },

  tab: {
    color: '#4B92D6',
    fontWeight: 'bold',
    margin: '5px',
    backgroundColor: 'white',
    borderRight: 'solid 2px #C6C6C6',
    '& :hover': {
      fontWeight: 'bold',
      color: 'red',
      backgroundColor: '#EAEFF3',
      borderRight: 'solid 2px #C6C6C6'
    }
  }
}));

//for Tab Controls
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Grid
      container
      justify="center"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Grid
          style={{ border: '2px solid #C6C6C6', padding: '10px', margin: '10px' }}
          container
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}>
          {children}
        </Grid>
      )}
    </Grid>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function tabHandle(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function TabsControl({ className, componets = [], ...props }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {}, []);

  return (
    <div>
      <div className={classes.mainDiv}>
        <Tabs indicatorColor="primary" value={value} onChange={handleTabChange} aria-label="simple tabs example">
          {componets.map(item => (
            <Tab key={item.index + 1} className={classes.tab} label={item.heading} {...tabHandle(item.index)} />
          ))}
        </Tabs>
        <br />
        {componets.map(item => (
          <TabPanel key={item.index + 1} value={value} index={item.index}>
            {item.component}
          </TabPanel>
        ))}
      </div>
    </div>
  );
}
