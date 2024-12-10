import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Select,
    MenuItem,
    Grid2,
    InputLabel,
    FormControl,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');
    console.log(token);
    const fetchUsers = async () => {
        try {
            const response = await fetch(
                'http://localhost:8080/api/admin/users',
                {
                    headers: {
                        method: 'GET',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    // const handleBlockUser = async (userId) => {
    //     try {
    //         const response = await fetch(`http://localhost:8080/api/users/block/${userId}`, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         if (response.ok) {
    //             fetchUsers();
    //         } else {
    //             console.error('Failed to block user:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Failed to block user:', error);
    //     }
    // };

    // const handlePromoteToAdmin = async (userId) => {
    //     try {
    //         const response = await fetch(`http://localhost:8080/api/users/promote/${userId}`, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         if (response.ok) {
    //             fetchUsers();
    //         } else {
    //             console.error('Failed to promote user:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Failed to promote user:', error);
    //     }
    // };
    useEffect(() => {
        fetchUsers();
    }, []);
    console.log(users);
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }}}>
            <Grid2 container spacing={4} paddingTop={3}>
                <Grid2 size={{ xs:12, sm:6 ,md:2 }}>
                    <TextField fullWidth label="User Name" variant="outlined" />
                </Grid2>
                <Grid2 size={{ xs:12, sm:6 ,md:3}}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                    />
                </Grid2>
                <Grid2 size={{ xs:12, sm:6 ,md:3}}>
                    <TextField fullWidth label="Email" variant="outlined" />
                </Grid2>
               
                {/* <Grid2 item xs={12} sm={6} md={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Status</InputLabel>
                        <Select label="Status">
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2> */}
            
                <Grid2 size={{ xs:12, sm:6 ,md:2}}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>User Type</InputLabel>
                        <Select label="User Type">
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Type1">Admin</MenuItem>
                            <MenuItem value="Type2">User</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
               
                <Grid2 item xs={12} sm={6} md={2} container alignItems="center">
                    <Button variant="contained" color="primary" fullWidth startIcon={<SearchIcon/>}>
                        Search
                    </Button>
                </Grid2>
            </Grid2>
            <Table className='mt-10'>
                <TableHead>
                    <TableRow>
                        <TableCell >ID</TableCell>
                        <TableCell>Tên</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Quyền</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user, index) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.userId}</TableCell>
                            <TableCell>
                                {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role.roleName}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    // onClick={() => handleBlockUser(user.id)}
                                >
                                    Khóa
                                </Button>
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}
