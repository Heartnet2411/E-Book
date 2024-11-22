import {
    Grid2,
    Box,
    Typography,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { url } from '../../config/config';
import { DataGrid } from '@mui/x-data-grid';
import { toast, Slide } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
export default function CommentManagement() {
    const [comments, setComments] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [filter, setFilter] = useState('all');
    const token = localStorage.getItem('token');
    const handleFilter = (event) => {
        setFilter(event.target.value);
    };
    const fetchComments = async () => {
        try {
            let response;
            response = await fetch(url + `/admin/comments/${filter}`, {
                headers: {
                    method: 'GET',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const rowsData = data.map((item, index) => ({
                id: item.comentId,
                ...item,
            }));
            setComments(rowsData);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };
    useEffect(() => {
        fetchComments();
    }, [filter]);
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Grid2 container spacing={4} paddingTop={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ flexGrow: 1, marginBottom: 2 }}
                    >
                        Bộ lọc
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Loại</InputLabel>
                        <Select
                            label="Comment Type"
                            value={filter}
                            onChange={handleFilter}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="book-cmt">Bình luận sách</MenuItem>
                            <MenuItem value="post-cmt">
                                Bình luận bài viết
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>
            <Grid2 marginTop={3}>
                {/* <DataGrid
                    // columns={commentColumns}
                    rows={comments}
                    rowHeight={50}
                    disableRowSelectionOnClick
                /> */}
            </Grid2>
        </Box>
    );
}
