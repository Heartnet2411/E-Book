import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          p: 1.5,
        }}
      >
        <img
                    src="..\..\logo512.png"
                    className=" w-24 cursor-pointer"
                    alt="logo"
                />
        <Typography variant="h6" noWrap>
          The Book Lounge
        </Typography>
                
      </Box>
      <Divider />
      <MenuContent />
      
    </Drawer>
  );
}
