// import React from 'react';
// import { IoCloseSharp } from 'react-icons/io5';

// export default function BookmarkModal({ onClose, bookmarks, onJump }) {
//     return (
//         <div className="bg-gray-900 text-white rounded-lg w-72">
//             <div className="">
//                 <IoCloseSharp
//                     className="cursor-pointer"
//                     size={24}
//                     onClick={onClose}
//                 />
//             </div>
//             <div className="">
//                 {bookmarks.map((bookmark, index) => (
//                     <div
//                         key={index}
//                         className="flex flex-cols mt-2 p-2 w-full hover:bg-gray-700 cursor-pointer"
//                         onClick={() => onJump(bookmark)}
//                     >
//                         <h2>{bookmark.content}</h2>
//                     </div>
//                 ))}
//             </div>

//         </div>
//     );
// }
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
import { IoCloseSharp } from 'react-icons/io5';

// TabPanel Component
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
    isOpen,
}) {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
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
                <h2 className="text-lg font-semibold">Bookmarks & Highlights</h2>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <IoCloseSharp size={24} />
                </IconButton>
            </div>

            {/* Tabs */}
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

            {/* Tab Panels */}
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
                                <ListItemText primary={bookmark.content} />
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
                                onClick={() => onJump(highlight)}
                                sx={{ '&:hover': { bgcolor: 'grey.800' } }}
                            >
                                <ListItemText primary={highlight.content} />
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
