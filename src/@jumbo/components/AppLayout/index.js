import CmtVerticalLayout from '@coremat/CmtLayouts/Vertical';
import CmtContent from '@coremat/CmtLayouts/Vertical/Content';
import CmtFooter from '@coremat/CmtLayouts/Vertical/Footer';
import CmtHeader from '@coremat/CmtLayouts/Vertical/Header';
import CmtSidebar from '@coremat/CmtLayouts/Vertical/Sidebar';
import { Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AuhMethods } from '../../../services/auth';
import globalStyles from '../../../theme/GlobalCss';
import { CurrentAuthMethod } from '../../constants/AppConstants';
import { LAYOUT_STYLES, SIDEBAR_TYPE } from '../../constants/ThemeOptions';
import ContentLoader from '../ContentLoader';
import AppContext from '../contextProvider/AppContextProvider/AppContext';
import Footer from './LayoutComponents/Footer';
import Header from './LayoutComponents/Header';
import SideBar from './LayoutComponents/SideBar';
import SidebarHeader from './LayoutComponents/SidebarHeader';

const useStyles = makeStyles(theme => ({
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
  sidebarHeight: {
    height: '100%'
  }
}));

const AppLayout = ({ className, children }) => {
  const [isTemplateLoaded, setTemplateLoading] = useState(false);
  const {
    layout,
    layoutStyle,
    themeType,
    updateThemeType,
    drawerBreakPoint,
    headerType,
    isSidebarFixed,
    sidebarType,
    sidebarStyle,
    sidebarSize,
    showFooter
  } = useContext(AppContext);
  const { loadUser } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  const location = useLocation();
  globalStyles();

  useEffect(() => {
    dispatch(AuhMethods[CurrentAuthMethod].getAuthUser());
    updateThemeType(themeType);
    setTemplateLoading(true);
  }, []);

  useEffect(() => {
    setLayoutType();
  }, [layoutStyle]);

  const setLayoutType = () => {
    if (layoutStyle === LAYOUT_STYLES.FULL_WIDTH) {
      document.body.classList.remove('layout-type-boxed');
      document.body.classList.remove('layout-type-framed');
      document.body.classList.add('layout-type-fullwidth');
    } else if (layoutStyle === LAYOUT_STYLES.BOXED) {
      document.body.classList.remove('layout-type-fullwidth');
      document.body.classList.remove('layout-type-framed');
      document.body.classList.add('layout-type-boxed');
    } else if (layoutStyle === LAYOUT_STYLES.FRAMED) {
      document.body.classList.remove('layout-type-boxed');
      document.body.classList.remove('layout-type-fullwidth');
      document.body.classList.add('layout-type-framed');
    }
  };

  if (!isTemplateLoaded || !loadUser) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  if (
    location.pathname === '/signin' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password'
  ) {
    return (
      <Box display="flex" width={1} style={{ height: '100vh' }}>
        {children}
      </Box>
    );
  }

  return (
    // <CmtVerticalLayout
    //   drawerBreakPoint={drawerBreakPoint}
    //   sidebarWidth={sidebarSize}>
    //   <CmtHeader type={headerType}>
    //     <Header />
    //   </CmtHeader>
    //   <CmtSidebar isSidebarFixed={isSidebarFixed} type={sidebarType} {...sidebarStyle}>
    //     <SidebarHeader />
    //     <SideBar />
    //   </CmtSidebar>
    //   <CmtContent>
    //     {children}
    //     <ContentLoader />
    //   </CmtContent>
    //   {showFooter && (
    //     <CmtFooter type="static">
    //       <Footer />
    //     </CmtFooter>
    //   )}
    // </CmtVerticalLayout>

    <CmtVerticalLayout
      drawerBreakPoint={drawerBreakPoint}
      sidebarWidth={sidebarSize}
      className={clsx('verticalMinimalLayout', className)}>
      <CmtHeader type={headerType}>
        <Header />
      </CmtHeader>
      <CmtSidebar type={SIDEBAR_TYPE.MINI} isSidebarFixed={isSidebarFixed} {...sidebarStyle}>
        <SidebarHeader />
        <SideBar />
      </CmtSidebar>
      <CmtContent>
        {children}
        <ContentLoader />
      </CmtContent>
      {showFooter && (
        <CmtFooter type="static">
          <Footer />
        </CmtFooter>
      )}
    </CmtVerticalLayout>
  );
};

export default AppLayout;
