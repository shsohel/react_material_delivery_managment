import { SAVE_PERMISSION, UPDATE_AUTH_USER, UPDATE_LOAD_USER } from '../../@jumbo/constants/ActionTypes';

const INIT_STATE = {
  authUser: null,
  userPermission: null,
  loadUser: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_AUTH_USER: {
      return {
        ...state,
        authUser: action.payload,
        loadUser: true
      };
    }
    case UPDATE_LOAD_USER: {
      return {
        ...state,
        loadUser: action.payload
      };
    }
    case SAVE_PERMISSION: {
      return {
        ...state,
        userPermission: action.payload
      };
    }
    default:
      return state;
  }
};
