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
import { EditIcon, InActiveIcon, ViewIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import { toastAlerts } from '@jumbo/utils/alerts';
import { Box, fade, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
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
  { label: 'Clients', link: '', isActive: true }
];

const ClientList = props => {
  const classes = useStyles();
  const [clientState, setClientState] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [recordForDetails, setrecordForDetails] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const { userPermission } = useSelector(({ auth }) => auth);
  const imageDataType = 'data:image/png;base64';

  async function getAllClients() {
    await axios
      .get(urls_v1.customer.get_all)
      .then(res => {
        const body = res.data.data;
        setClientState(body);
      })
      .catch();
  }
  useEffect(() => {
    getAllClients();
  }, []);

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls_v1.customer.delete}/${key}`).then(({ data }) => {
      if (data.succeeded) {
        toastAlerts('success', 'Client successfully deleted!!');
        getAllClients();
      } else {
        toastAlerts('error', 'There was an error!!');
      }
    });
  };

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

  const onEdit = client => {
    props.history.replace('/clients/edit', { client });
  };

  return (
    <PageContainer heading="Clients" breadcrumbs={breadcrumbs}>
      {userPermission?.includes(clients.CREATE) && (
        <NavLink to="/clients/new">
          <Button variant="outlined" color="primary" size="small" endIcon={<Add />}>
            New
          </Button>
        </NavLink>
      )}
      <br /> <br />
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
                      <EditIcon
                        title="Edit Client"
                        placement="top"
                        onClick={() => {
                          onEdit(row);
                        }}
                      />
                    )}

                    {userPermission?.includes(clients.DELETE) && (
                      <InActiveIcon
                        title="Inactive Client"
                        placement="top"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure to inactive this record?',
                            subTitle: "You cann't undo this operation",
                            onConfirm: () => {
                              onDelete(row.key);
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
        <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </GridContainer>
    </PageContainer>
  );
};

export default ClientList;
