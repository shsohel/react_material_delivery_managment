import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import decodeme from 'jwt-decode';
import qs from 'querystring';
import React from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { fetchError, fetchStart, fetchSuccess } from '../../../redux/actions';
import { saveUserPermission, setAuthUser, updateLoadUser } from '../../../redux/actions/Auth';
import axios from './config';

const JWTAuth = {
  onRegister: ({ name, email, password }) => {
    return dispatch => {
      dispatch(fetchStart());
      axios
        .post('auth/register', {
          email: email,
          password: password,
          name: name
        })
        .then(({ data }) => {
          if (data.result) {
            localStorage.setItem('token', data.token.access_token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token.access_token;
            dispatch(fetchSuccess());
            dispatch(JWTAuth.getAuthUser(true, data.token.access_token));
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function(error) {
          dispatch(fetchError(error.message));
        });
    };
  },

  onLogin: ({ userName, password }) => {
    return dispatch => {
      try {
        dispatch(fetchStart());
        axios
          .post(
            '/connect/token',
            qs.stringify({
              userName: userName,
              password: password,
              grant_type: 'password',
              client_id: 'erl_bdms_spa',
              client_secret: 'ErlBdms$ecret',
              scope: 'erl_bdms_api'
            })
          )
          .then(({ data }) => {
            if (data) {
              localStorage.setItem('token', data.access_token);
              var getToken = decodeme(data.access_token);
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
              dispatch(saveUserPermission(getToken.permission));
              dispatch(fetchSuccess());
              dispatch(JWTAuth.getAuthUser(true, data.access_token));
            } else {
              dispatch(fetchError(data.error));
            }
          })
          .catch(function(error) {
            dispatch(fetchError(error.message));
          });
      } catch (error) {
        dispatch(fetchError(error.message));
      }
    };
  },

  getAuthUser: (loaded = false, access_token) => {
    return dispatch => {
      if (!access_token) {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        if (token) {
          var getToken = decodeme(token);
          dispatch(saveUserPermission(getToken.permission));
        }
      }
      dispatch(fetchStart());
      dispatch(updateLoadUser(loaded));

      const token = localStorage.getItem('token');
      if (token) {
        axios
          .get(`${urls_v1.account.users.get_me}`)
          .then(({ data }) => {
            if (data.isEnabled) {
              dispatch(fetchSuccess());
              dispatch(setAuthUser(data));
            } else {
              dispatch(updateLoadUser(true));
            }
          })
          .catch(({ response }) => {
            if (response === undefined || response || response.status === 401) {
              localStorage.removeItem('token');
              dispatch(updateLoadUser(true));
            }
          });
      } else {
        dispatch(updateLoadUser(true));
      }
    };
  },

  onLogout: logOut => {
    return dispatch => {
      dispatch(fetchStart());
      if (!logOut) {
        dispatch(fetchSuccess());
        localStorage.removeItem('token');
        dispatch(setAuthUser(null));
      } else {
        dispatch(fetchError('Error'));
      }
    };
  },

  onForgotPassword: email => {
    return dispatch => {
      dispatch(fetchStart());
      if (email) {
        axios
          .post(`${urls_v1.account.users.forgot_password}?${qs.stringify(email)}`)
          .then(res => {
            if (res.status === 200) {
              NotificationManager.success('Email sent successfully');
              dispatch(fetchSuccess());
            }
          })
          .catch(function(error) {
            dispatch(updateLoadUser(true));
          });
      } else {
        dispatch(updateLoadUser(true));
      }
    };
  },
  onResetPassword: resetPass => {
    return dispatch => {
      dispatch(fetchStart());
      if (resetPass) {
        axios
          .post(`${urls_v1.account.users.reset_password}?${qs.stringify(resetPass.resetPass)}`)
          .then(({ data }) => {
            dispatch(fetchSuccess());
            NotificationManager.success(data.message);
          })
          .catch(({ response }) => {
            dispatch(updateLoadUser(true));
            NotificationManager.warning(response.data.Message);
          });
      } else {
        dispatch(updateLoadUser(true));
      }
    };
  },

  getSocialMediaIcons: () => {
    return <React.Fragment></React.Fragment>;
  }
};

export default JWTAuth;
