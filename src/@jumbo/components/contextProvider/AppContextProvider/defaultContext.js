import defaultTheme from '../../../../theme/defaultTheme';
import {
  DRAWER_BREAK_POINT,
  HEADER_TYPE,
  LAYOUT_STYLE,
  LAYOUT_TYPES,
  SIDEBAR_TYPE,
  SIDEBAR_WIDTH,
  THEME_TYPES,
} from '../../../constants/ThemeOptions';

export default {
  theme: defaultTheme,
  defaultLng: {
    languageId: 'english',
    locale: 'en',
    name: 'English',
    icon: 'us',
  },
  layoutType: LAYOUT_STYLE.BOXED,
  layout: LAYOUT_TYPES.VERTICAL_DEFAULT,
  themeType: THEME_TYPES.LIGHT,
  drawerBreakPoint: DRAWER_BREAK_POINT.MD,
  headerType: HEADER_TYPE.FIXED,
  sidebarType: SIDEBAR_TYPE.FULL,
  isSidebarFixed: true,
  sidebarWidth: SIDEBAR_WIDTH.DEFAULT,
  isHeaderFull: false,
};
