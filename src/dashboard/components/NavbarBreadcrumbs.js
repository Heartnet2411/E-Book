import React from 'react';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { styled } from '@mui/material/styles';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

const breadcrumbNameMap = {
  '/admin/posts': 'Bài viết',
  '/admin/comments': 'Bình luận',
  '/admin/report-comments': 'Bình luận bị báo cáo',
  '/admin/users': 'Độc giả',
  '/admin/hidden-posts': 'Bài viết bị ẩn',
  '/admin/hidden-comments': 'Bình luận bị ẩn',
  '/admin/report-posts': 'Bài viết bị báo cáo',
  '/admin/topic': 'Chủ đề',
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography key={to} variant="body1" sx={{ color: 'text.primary', fontWeight: 600, fontSize:'20px' }}>
            {breadcrumbNameMap[to]}
          </Typography>
        ) : (
          <Typography key={to} variant="body1" >
            {breadcrumbNameMap[to]}
          </Typography>
        );
      })}
    </StyledBreadcrumbs>
  );
}