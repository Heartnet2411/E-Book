import {
    Grid2,
    Box,
    Typography,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
} from '@mui/material';

export default function CommentManagement() {
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
                        <Select label="Comment Type">
                            <MenuItem value="All" >Tất cả</MenuItem>
                            <MenuItem value="book-cmt">Bình luận sách</MenuItem>
                            <MenuItem value="post-cmt">
                                Bình luận bài viết
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>
        </Box>
    );
}
