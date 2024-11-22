import React, { useState } from 'react';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tabs,
    Tab,
    Box,
    Typography,
} from '@mui/material';
import { IoCloseSharp, IoTrashOutline } from 'react-icons/io5';
import { formatDate } from '../../utils/formatDate';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function BookmarkModal({
    onClose,
    bookmarks = [],
    highlights = [],
    onJump,
    onJumpHighlight,
    isOpen,
    onDeleteBookmark,
    onDeleteHighlight,
}) {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    // const formatDate = (date) => {
    //     const newDate = new Date(date);
    //     return newDate.toLocaleString();
    // };
    const handleDelete = (id) => {
        onDeleteBookmark(id);
    };
    const handleDeleteHighlight = (highlightId, cfiRange) => {
        onDeleteHighlight(highlightId, cfiRange);
    };
    const truncateText = (text, maxLength = 53) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };
    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                sx: { width: 300, bgcolor: 'grey.900', color: 'white' },
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">
                    Bookmarks & Highlights
                </h2>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <IoCloseSharp size={24} />
                </IconButton>
            </div>

            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="Bookmarks and Highlights"
                variant="fullWidth"
                textColor="inherit"
                indicatorColor="primary"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="Bookmarks" />
                <Tab label="Highlights" />
            </Tabs>

            <TabPanel value={tabIndex} index={0}>
                {bookmarks.length > 0 ? (
                    <List>
                        {bookmarks.map((bookmark, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => onJump(bookmark)}
                                sx={{ '&:hover': { bgcolor: 'grey.800' } }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            {bookmark.content}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption">
                                            {formatDate(bookmark.date)}
                                        </Typography>
                                    }
                                />
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngừng lan truyền sự kiện để không gọi onJump
                                        handleDelete(bookmark.bookmarkId);
                                    }}
                                    sx={{ color: 'red' }}
                                >
                                    <IoTrashOutline />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No bookmarks available</Typography>
                )}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                {highlights.length > 0 ? (
                    <List>
                        {highlights.map((highlight, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => onJumpHighlight(highlight)}
                                sx={{ '&:hover': { bgcolor: 'grey.800' } }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            {truncateText(highlight.text)}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption">
                                            {formatDate(highlight.date)}
                                        </Typography>
                                    }
                                />
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteHighlight(
                                            highlight.highlightId,
                                            highlight.cfiRange
                                        );
                                    }}
                                    sx={{ color: 'red' }}
                                >
                                    <IoTrashOutline />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No highlights available</Typography>
                )}
            </TabPanel>
        </Drawer>
    );
}
