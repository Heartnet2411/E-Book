import * as React from 'react';
import { alpha } from '@mui/material/styles';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import UserManagement from './components/UserManagement';
import CommentManagement from './components/CommentManagement';
import ReportedComment from './components/ReportedComment';
import PostManagement from './components/PostManagement';
import EnhancedTable from './components/Test';


export default function Dashboard(props) {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        if (user && user.roleId === 'role_admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
            // Điều hướng đến trang lỗi hoặc hiển thị thông báo lỗi
            // navigate('/error');
        }
        console.log(user);
    }, [navigate]);
    if (!isAdmin) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Typography variant="h4" color="error">
                    Bạn không có quyền truy cập trang này.
                </Typography>
            </Box>
        );
    }
    return (
        <AppTheme {...props} >
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu />
                {/* <AppNavbar /> */}
                {/* Main content */}
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                            : alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                        }}
                    >
                        <Header user={user} />
                        <Routes>
                            <Route path="/" element={<MainGrid />} />
                            <Route
                                path="/posts"
                                element={<PostManagement/>}
                            />
                            <Route
                                path="/comments"
                                element={<CommentManagement/>}
                            />
                            <Route 
                            path="/report-comments"
                            element={<ReportedComment/>}
                            />
                            <Route
                                path="/users"
                                element={<UserManagement/>}
                            />
                        </Routes>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}
