// UserLayout.tsx
import { ReactNode } from 'react';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Layout from 'src/@core/layouts/Layout';
import VerticalNavItems from 'src/navigation/vertical';
import HorizontalNavItems from 'src/navigation/horizontal';
import VerticalAppBarContent from './components/vertical/AppBarContent';
import HorizontalAppBarContent from './components/horizontal/AppBarContent';
import { useSettings } from 'src/@core/hooks/useSettings';
import { useAuth } from 'src/hooks/useAuth'; // Thêm import useAuth

interface Props {
  children: ReactNode;
  contentHeightFixed?: boolean;
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  const { settings, saveSettings } = useSettings();
  const { user } = useAuth(); // Lấy user từ AuthContext
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical';
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: VerticalNavItems(user), // Truyền user vào VerticalNavItems
        },
        appBar: {
          content: (props) => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          ),
        },
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems(),
          },
          appBar: {
            content: () => <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />,
          },
        },
      })}
    >
      {children}
    </Layout>
  );
};

export default UserLayout;
