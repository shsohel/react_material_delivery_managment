import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { ViewIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import {
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { DraftsOutlined, InboxOutlined, RemoveRedEyeOutlined, SendOutlined, Settings } from '@material-ui/icons';
import Moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from '../../../../services/auth/jwt/config';
import OrderConfirmedForm from './OrderConfirmedForm';
import OrderPreview from './OrderPreview';

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
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: '#C6C6C6'
    },
    '& tbody td': {
      fontWeight: 'normal'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    }
  },
  tab: {
    color: 'green',
    fontWeight: 'bold',
    margin: '5px',
    backgroundColor: 'white',
    border: 'solid 2px #C6C6C6'
  },
  tContainer: {
    marginBottom: theme.spacing(3)
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Orders Confirmation', link: '/orders/order-confirmation', isActive: true }
];

///For Status
const ConfirmationStatus = {
  Reject: 'Reject',
  Review: 'Review',
  Approve: 'Approve'
};
//For Menu
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

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
        <Grid container item xs={12} sm={12} md={12} lg={12}>
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

export default function OrderConfirmation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [orderPending, setOrderPending] = useState([]);
  const [orderApproved, setOrderApproved] = useState([]);
  const [recordForDetails, setrecordForDetails] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleActionButtonOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionButtonClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const getAllPendingOrders = async () => {
    try {
      await axios.get(`${urls_v1.order.get_pending_orders}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setOrderPending(body);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getAllApprovalOrders = async () => {
    try {
      await axios.get(`${urls_v1.order.get_approved_orders}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setOrderApproved(body);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllPendingOrders();
    getAllApprovalOrders();
  }, []);

  const PreviewOrder = key => {
    if (key) {
      axios.get(`${urls_v1.order.get_by_key}/${key}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setrecordForDetails(body);
          setOpenPopup(true);
        }
      });
    }
  };

  ///Dialog Open For Edit
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const openInPopup = (orderId, status) => {
    const body = {
      orderId: orderId,
      status: status
    };
    setrecordForDetails(null);
    setRecordForEdit(body);
    setOpenPopup(true);
  };

  const closePopup = () => {
    getAllPendingOrders();
    getAllApprovalOrders();
    setOpenPopup(false);
  };

  return (
    <div>
      <PageContainer heading="Order Confirmation Process" breadcrumbs={breadcrumbs}>
        <div className={classes.mainDiv}>
          <Tabs indicatorColor="primary" value={value} onChange={handleTabChange} aria-label="simple tabs example">
            <Tab className={classes.tab} label="Pending List" {...tabHandle(0)} />
            <Tab className={classes.tab} label="Approved List" {...tabHandle(1)} />
          </Tabs>

          <TabPanel value={value} index={0}>
            <TableContainer component={Paper} padding="default">
              <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>SL</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell align="left">Customer Name</TableCell>
                    <TableCell align="left">Request Date</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                {orderPending.length > 0 ? (
                  <TableBody>
                    {orderPending.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {item.orderNumber}
                        </TableCell>
                        <TableCell align="left">{item.customerName}</TableCell>
                        <TableCell>{Moment(item.requestDate).format('DD-MMM-yyyy')}</TableCell>
                        <TableCell align="center">
                          <IconButton aria-haspopup="true" onClick={handleActionButtonOpen}>
                            <Settings />
                          </IconButton>
                          <StyledMenu
                            id="customized-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleActionButtonClose}>
                            <StyledMenuItem
                              onClick={() => {
                                setOpenPopup(true);
                                openInPopup(item.id, ConfirmationStatus.Approve);
                              }}>
                              <ListItemIcon>
                                <SendOutlined fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Approved" />
                            </StyledMenuItem>
                            <StyledMenuItem
                              onClick={() => {
                                setOpenPopup(true);
                                openInPopup(item.id, ConfirmationStatus.Reject);
                              }}>
                              <ListItemIcon>
                                <DraftsOutlined fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Reject" />
                            </StyledMenuItem>
                            <StyledMenuItem
                              onClick={() => {
                                setOpenPopup(true);
                                openInPopup(item.id, ConfirmationStatus.Review);
                              }}>
                              <ListItemIcon>
                                <InboxOutlined fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Review" />
                            </StyledMenuItem>
                          </StyledMenu>
                          <IconButton
                            aria-haspopup="true"
                            onClick={() => {
                              PreviewOrder(item.key);
                            }}>
                            <RemoveRedEyeOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TableContainer component={Paper}>
              <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>SL</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell align="left">Customer Name</TableCell>
                    <TableCell align="left">Request Date and Time</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                {orderApproved.length > 0 ? (
                  <TableBody>
                    {orderApproved.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {item.orderNumber}
                        </TableCell>
                        <TableCell align="left">{item.customerName}</TableCell>
                        <TableCell>{Moment(item.requestDate).format('DD-MMM-yyyy')}</TableCell>
                        <TableCell align="center">
                          <ViewIcon
                            title="View Order"
                            placement="top"
                            onClick={() => {
                              PreviewOrder(item.key);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : null}
              </Table>
            </TableContainer>
          </TabPanel>
          {recordForDetails ? (
            <Controls.Popup title="Order Details " openPopup={openPopup} setOpenPopup={setOpenPopup}>
              <OrderPreview closePopup={closePopup} recordForDetails={recordForDetails} />
            </Controls.Popup>
          ) : (
            <Controls.Popup title="Remarking...." openPopup={openPopup} setOpenPopup={setOpenPopup}>
              <OrderConfirmedForm closePopup={closePopup} recordForEdit={recordForEdit} />
            </Controls.Popup>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
