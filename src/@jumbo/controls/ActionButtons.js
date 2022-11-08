import { Button, fade, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import {
  Add,
  AddCircleOutline,
  Cancel,
  CancelPresentation,
  CheckCircleOutline,
  DeleteOutline,
  DoneAll,
  EditOutlined,
  FilterListSharp,
  Lock,
  MoreVert,
  PersonAddDisabled,
  PlaylistAddCheck,
  PrintOutlined,
  RemoveCircleOutlined,
  RemoveRedEyeOutlined,
  Search,
  SettingsOutlined,
  ThreeSixty
} from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
  AddButton: {
    color: '#4CAF50'
  },
  editButton: {
    color: '#4CAF50'
  },
  deleteButton: {
    color: 'red'
  },
  removeButton: {
    color: '#E90052'
  },
  viewButton: {
    color: '#0795F4'
  },
  SettingsButton: {
    color: '#38003C'
  },
  PrintButton: {
    color: '#018786'
  },
  CancelButton: {
    color: '#C76300'
  },
  CheckButton: {
    color: '#4CAF50'
  },
  toolTip: {},
  ConfirmButton: {
    color: '#115293'
  },
  reviewIcon: {
    color: '#CFA135'
  },
  filterButton: {
    color: '#115293'
  },
  accountButton: {
    backgroundColor: 'white'
  },
  cancelFilterButton: {
    color: 'red'
  },
  searchBoxButton: {
    color: 'green'
  },
  passwordButton: {
    '&.password': {
      backgroundColor: fade(theme.palette.success.main, 0.18),
      color: 'green'
    }
  },
  submitButton: {
    color: 'green'
  }
  // iconButton: {
  //     border: 'solid 1.5px green',
  //     fontWeight: '800',
  //     '&.new': {
  //         backgroundColor: fade(theme.palette.success.main, 0.18),
  //         color: 'green',
  //     },
  // },
}));

export const ProfileIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.accountButton} color={color} disabled={disabled} onClick={onClick}>
            <MoreVert />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const NewButton = props => {
  const classes = useStyles();
  const { color, onClick, disabled, ...others } = props;
  return (
    <>
      <Button
        className={clsx(classes.iconButton, 'new')}
        variant="outlined"
        color="primary"
        size="small"
        onClick={onClick}
        endIcon={<Add />}>
        New
      </Button>
    </>
  );
};
export const SubmitButton = props => {
  const classes = useStyles();
  const { color, onClick, disabled, ButtonLabel, ...others } = props;
  return (
    <>
      <Button
        className={classes.submitButton}
        variant="outlined"
        color="primary"
        size="small"
        disabled={disabled}
        onClick={onClick}
        {...others}>
        {ButtonLabel}
      </Button>
    </>
  );
};

export const PasswordIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton
            size="small"
            disabled={disabled}
            onClick={onClick}
            className={clsx(classes.passwordButton, 'password')}
            color={color}>
            <Lock />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const AddIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} onClick={onClick} className={classes.AddButton} color={color}>
            <AddCircleOutline />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const EditIcon = ({ title, placement, color, onClick, disabled, ...others }) => {
  const classes = useStyles();
  //const { title, placement, color, onClick, disabled, ...others } = props
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.editButton} disabled={disabled} onClick={onClick}>
            <EditOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const ActiveIcon = ({ title, placement, color, onClick, disabled, ...others }) => {
  const classes = useStyles();
  //const { title, placement, color, onClick, disabled, ...others } = props
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.editButton} disabled={disabled} onClick={onClick}>
            <DoneAll />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const DeleteIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} className={classes.deleteButton} onClick={onClick}>
            <DeleteOutline />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const InActiveIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} className={classes.deleteButton} onClick={onClick}>
            <PersonAddDisabled />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const RemoveIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.removeButton} disabled={disabled} onClick={onClick}>
            <RemoveCircleOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const ViewIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} onClick={onClick} className={classes.viewButton}>
            <RemoveRedEyeOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const SettingsIcon = props => {
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} onClick={onClick} color={color || 'primary'}>
            <SettingsOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const PrintIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.PrintButton} color={color} disabled={disabled} onClick={onClick}>
            <PrintOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const CancelIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.CancelButton} color={color} disabled={disabled} onClick={onClick}>
            <CancelPresentation />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const CheckIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.CheckButton} color={color} disabled={disabled} onClick={onClick}>
            <CheckCircleOutline />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const ConfirmIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.ConfirmButton} color={color} disabled={disabled} onClick={onClick}>
            <PlaylistAddCheck />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

//#region ReviewIcon
export const ReviewIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.reviewIcon} color={color} disabled={disabled} onClick={onClick}>
            <ThreeSixty />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

// ReviewIcon.propTypes = {
//   title: PropTypes.string.isRequired,
//   placement: PropTypes.string.isRequired
// };

//#endregion

export const FilterIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.filterButton} color={color} disabled={disabled} onClick={onClick}>
            <FilterListSharp />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const CancelFilterIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton
            size="small"
            className={classes.cancelFilterButton}
            color={color}
            disabled={disabled}
            onClick={onClick}>
            <Cancel />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const SearchIcon = props => {
  const classes = useStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.searchBoxButton} color={color} disabled={disabled} onClick={onClick}>
            <Search />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
