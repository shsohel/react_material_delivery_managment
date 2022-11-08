import CmtAdvCard from '@coremat/CmtAdvCard';
import CmtAdvCardContent from '@coremat/CmtAdvCard/CmtAdvCardContent';
import CmtAvatar from '@coremat/CmtAvatar';
import CmtCardActions from '@coremat/CmtCard/CmtCardActions';
import CmtCardMedia from '@coremat/CmtCard/CmtCardMedia';
import CmtObjectSummary from '@coremat/CmtObjectSummary';
import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { clients } from '@jumbo/constants/PermissionsType';
import { ActiveIcon, ViewIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import { toastAlerts } from '@jumbo/utils/alerts';
import { Box, fade, Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { lighten, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../services/auth/jwt/config';
import ClientView from './ClientView';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  cardMediaRoot: {
    position: 'relative',
    marginBottom: 0,
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: fade(theme.palette.common.black, 0.6)
    },
    '& > *': {
      position: 'relative',
      zIndex: 2
    }
  },
  cardMediaContent: {
    padding: '15px 15px 15px  15px',
    position: 'relative',
    zIndex: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    '& .Cmt-badge-avatar': {
      border: `solid 2px ${theme.palette.success.main}`,
      padding: 5,
      borderRadius: '50%'
    },
    '& .Cmt-badge': {
      padding: 0,
      backgroundColor: 'transparent',
      marginBottom: -36,
      marginLeft: -15
    },
    '& .Cmt-user-info': {
      marginTop: 15,
      '& .Cmt-title': {
        fontSize: 16,
        fontWeight: theme.typography.fontWeightBold
      }
    }
  },
  avatarRoot: {
    border: `solid 2px ${theme.palette.common.white}`
  },
  cardColor: {
    backgroundColor: theme.palette.card
  },
  cardActionButton: {
    display: 'flex',
    flexDirection: 'row-reverse',
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Inactive Clients', link: '', isActive: true }
];

const ClientList = props => {
  const classes = useStyles();
  const [clientState, setClientState] = useState([]);
  const [recordForDetails, setrecordForDetails] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const { userPermission } = useSelector(({ auth }) => auth);
  const imageDataType = 'data:image/png;base64';
  const [confirmationDialog, setConfirmationDialog] = useState({ isOpen: false, heading: '', title: '', subTitle: '' });

  async function getAllClients() {
    await axios
      .get(urls_v1.customer.get_all_archived)
      .then(res => {
        const body = res.data.data;
        setClientState(body);
      })
      .catch();
  }
  useEffect(() => {
    getAllClients();
  }, []);

  const PreviewClient = key => {
    if (key) {
      axios.get(`${urls_v1.customer.get_by_key}/${key}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setrecordForDetails(body);
          setOpenPopup(true);
        }
      });
    }
  };
  const closePopup = () => {
    getAllClients();
    setOpenPopup(false);
  };

  const onActivate = row => {
    setConfirmationDialog({ ...confirmationDialog, isOpen: false });
    const data = { ...row };
    data.logo = row?.logo;
    data.isActive = true;
    axios
      .put(`${urls_v1.customer.put}/${data.key}`, data)
      .then(({ data }) => {
        if (data.succeeded) {
          toastAlerts('success', 'Client Activated');
          props.history.replace('/clients/active-clients');
        }
      })
      .catch(error => {
        toastAlerts('error', 'There was an error.Please contact with admin!');
      });
  };

  return (
    <PageContainer heading="Clients" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <GridContainer>
        {clientState.map(row => (
          <Grid key={row.id} item xs={12} sm={12} md={3} lg={3}>
            <CmtAdvCard>
              <CmtCardMedia>
                <Box className={classes.cardMediaContent}>
                  <CmtObjectSummary
                    avatar={<CmtAvatar className={classes.avatarRoot} size={155} src={`${imageDataType},${row.logo}`} />}
                    title={row.nameEN}
                    titleProps={{ style: { color: '#1D4354' } }}
                    subTitle={row.shortNameEN}
                    subTitleProps={{ style: { color: '#1D4354' } }}
                    avatarProps={{ variant: 'circle' }}
                    align="vertical"
                  />
                </Box>
              </CmtCardMedia>
              <Divider className={classes.dividerColor} variant="middle" />
              <CmtAdvCardContent>
                <CmtCardActions className={classes.cardActionButton}>
                  <>
                    {userPermission?.includes(clients.EDIT) && (
                      <ActiveIcon
                        title="Active Client"
                        placement="top"
                        onClick={() => {
                          setConfirmationDialog({
                            isOpen: true,
                            heading: 'Clinet Activation',
                            title: 'Are you sure to active this client?',
                            onConfirm: () => {
                              onActivate(row);
                            }
                          });
                        }}
                      />
                    )}
                    <ViewIcon
                      title="View Client Details"
                      placement="top"
                      onClick={() => {
                        PreviewClient(row.key);
                      }}
                    />
                  </>
                </CmtCardActions>
              </CmtAdvCardContent>
            </CmtAdvCard>
          </Grid>
        ))}
        {recordForDetails ? (
          <Controls.Popup title="Client Details " openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <ClientView closePopup={closePopup} recordForDetails={recordForDetails} />
          </Controls.Popup>
        ) : (
          ''
        )}
        <Controls.ConfirmationDialog confirmationDialog={confirmationDialog} setConfirmationDialog={setConfirmationDialog} />
      </GridContainer>
    </PageContainer>
  );
};

export default ClientList;
