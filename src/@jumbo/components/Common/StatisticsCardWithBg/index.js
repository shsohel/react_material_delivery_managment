import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import CmtCard from '../../../../@coremat/CmtCard';
import CmtCardHeader from '../../../../@coremat/CmtCard/CmtCardHeader';

const useStyles = makeStyles(theme => ({
  cardRoot: {
    '& .Cmt-action-menu': {
      alignItems: 'flex-start'
    }
  },
  cardHeaderRoot: {
    paddingTop: 16,
    paddingBottom: 16,
    '& .Cmt-action-default-menu': {
      alignItems: 'flex-start',
      marginTop: 5
    }
  },
  titleRoot: {
    fontSize: 24,
    marginBottom: 2,
    color: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      fontSize: 16
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 18
    }
  }
}));

const StatisticsCardWithBg = ({ title, subTitle, children, textColor, icon, ...rest }) => {
  const classes = useStyles();
  return (
    <CmtCard {...rest} className={classes.cardRoot}>
      <CmtCardHeader
        className={classes.cardHeaderRoot}
        titleProps={{
          variant: 'h1',
          component: 'div',
          className: classes.titleRoot
        }}
        title={title}
        subTitle={subTitle}
        subTitleProps={{ style: { color: '#fff', fontSize: 24, marginTop: 0 } }}>
        {icon}
      </CmtCardHeader>
      {children}
    </CmtCard>
  );
};

export default StatisticsCardWithBg;
