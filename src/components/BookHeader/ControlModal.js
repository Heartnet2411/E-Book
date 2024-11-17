// import React from 'react';
// import { IoCloseSharp } from 'react-icons/io5';
// import { IoShareSocialSharp } from 'react-icons/io5';
// import { IoMdDownload } from 'react-icons/io';
// import { MdContentCopy } from 'react-icons/md';
// const ControlModal = ({ onClose, epubUrl, onCopy }) => {
//     return (
//         <div className="bg-gray-900 text-white rounded-lg w-52">
//             <div className="">
//                 <IoCloseSharp
//                     className="cursor-pointer"
//                     size={24}
//                     onClick={onClose}
//                 />
//             </div>
//             <div className="">
//                 {/* <div className=" flex flex-cols p-2 mt-2 w-full hover:bg-gray-700"> */}
//                 {/* <IoShareSocialSharp size={24} /> */}
//                 {/* <h2 className='ml-3'>Chia sẻ</h2>  */}
//                 {/* </div> */}
//                 <a href={epubUrl}>
//                     <div className="flex flex-cols mt-2 p-2 w-full hover:bg-gray-700 cursor-pointer">
//                         <IoMdDownload size={24} />

//                         <h2 className="ml-3">Tải về</h2>
//                     </div>
//                 </a>
//                 <div
//                     onClick={onCopy}
//                     className="flex flex-cols mt-2 p-2 w-full hover:bg-gray-700 cursor-pointer"
//                 >
//                     <MdContentCopy size={24} />
//                     <h2 className="ml-3">Sao chép liên kết</h2>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default ControlModal;
import React from 'react';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { IoCloseSharp } from 'react-icons/io5';
import { IoMdDownload } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';

const ControlModal = ({ onClose, epubUrl, onCopy, isOpen }) => {
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
            <div className="flex justify-between items-center p-4 border-b border-gray-500">
                <h2 className="text-lg font-semibold">Tùy chọn</h2>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <IoCloseSharp size={24} />
                </IconButton>
            </div>

            {/* Content */}
            <List>
                {/* Download */}
                <ListItem
                    button
                    component="a"
                    href={epubUrl}
                    sx={{
                        '&:hover': {
                            bgcolor: 'primary.main', // Màu phụ khi hover
                            // color: 'white',
                        },
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    <ListItemIcon 
                >
                        <IoMdDownload size={24} style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Tải về" />
                </ListItem>

                {/* Copy Link */}
                <ListItem button onClick={onCopy} sx={{
                        '&:hover': {
                            bgcolor: 'primary.main', // Màu phụ khi hover
                            color: 'white',
                        },
                        transition: 'background-color 0.3s ease',
                    }}>
                    <ListItemIcon>
                        <MdContentCopy size={24} style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Sao chép liên kết" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default ControlModal;
