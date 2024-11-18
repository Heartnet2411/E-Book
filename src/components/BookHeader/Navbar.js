// src/components/BookHeader/Navbar.js
import React, { useContext } from 'react';
import { IoMdSettings, IoIosListBox, IoMdSearch, ioMd } from 'react-icons/io';
import { MdFullscreen } from 'react-icons/md';
import { RiHeadphoneFill } from 'react-icons/ri';
import { useState } from 'react';
import { BsThreeDotsVertical, BsBookmarkPlusFill } from 'react-icons/bs';
import {
    Drawer,
    List,
    ListItemText,
    Paper,
    InputBase,
    IconButton,
    ListSubheader,
    ListItemButton,
} from '@mui/material';
import { SeriesContext } from '@mui/x-charts/internals';
// import { readerContext } from '../../screens/BookReader/BookReader';
const Navbar = ({
    onShowBookmark,
    isBookmarked,
    onBookmark,
    onSettings,
    onFullScreen,
    onControl,
    title,
    onSearch,
    setSearchResults,
    searchResults,
    rendition,
    setCurrentPage,
    bookmarked,
}) => {
    const [searchText, setSearchText] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [matchSearches, setMatches] = useState([]);
    // const context = useContext(readerContext)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchText);
            setShowResults(true);
        }
    };
    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 100);
        setSearchResults([])
    };
    const onListItemClick = async (href, paragraph) => {
        await rendition?.current?.display(href);

        const win = document.querySelector('iframe')?.contentWindow;
        if (win) {
            const body = win.document.documentElement.querySelector('body');
            if (body) {
                const regExp = new RegExp(
                    `(<[\\w\\d]+>)?.*(${searchText}).*<\\/?[\\w\\d]+>`,
                    'ig'
                );
                body.innerHTML = body.innerHTML.replace(
                    regExp,
                    (match, sub1, sub2) => {
                        return match.replace(sub2, `<mark>${sub2}</mark>`);
                    }
                );
            }
        }
         setCurrentPage(href);
    };
    return (
        <nav className="navbar flex justify-between bg-gray-900 text-white p-3">
            <div className="flex items-center">
                <IoMdSearch size={24} className="mr-4 hover:cursor-pointer" />
                <input
                    type="text"
                    className=" p-2 rounded-lg text-black h-8"
                    placeholder="Tìm kiếm..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowResults(true)}
                    onBlur={handleBlur}
                />
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-12  text-black left-0 w-110 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
                        <List
                            style={{
                                width: '400px',
                                marginTop: 1,
                                backgroundColor: 'background.paper',
                            }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader
                                    component="div"
                                    id="nested-list-subheader"
                                    style={{ width: '100%' }}
                                >
                                    {/* Result：Total {matchSearches.length} Record */}
                                </ListSubheader>
                            }
                        >
                            {searchResults.map((item, index) => {
                                return item ? (
                                    <ListItemButton
                                    onMouseDown={() =>
                                            onListItemClick(
                                                item.href,
                                                item.paragraph
                                            )
                                        }
                                        key={index}
                                    >
                                        <ListItemText
                                            style={{ height: '50px' }}
                                        >
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        item && item.paragraph
                                                            ? item.paragraph.replace(
                                                                  new RegExp(
                                                                      searchText,
                                                                      'ig'
                                                                  ),
                                                                  `<span class="highlight">${searchText}</span>`
                                                              )
                                                            : '',
                                                }}
                                            ></p>
                                        </ListItemText>
                                    </ListItemButton>
                                ) : null;
                            })}
                        </List>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center">
                <h1>{title}</h1>
            </div>
            <ul className="custom flex items-center space-x-6">
                <li>
                    {/* <RiHeadphoneFill size={24} className="hover:cursor-pointer"/> */}
                    <IoIosListBox
                        size={24}
                        className="hover:cursor-pointer"
                        onClick={onShowBookmark}
                    />
                </li>
                <li>
                    {bookmarked ? (
                        <BsBookmarkPlusFill
                            size={22}
                            onClick={onBookmark}
                             color="yellow"
                            className="hover:cursor-pointer"
                        />
                    ) : (
                        <BsBookmarkPlusFill
                            size={22}
                            onClick={onBookmark}
                            // color="yellow"
                            className="hover:cursor-pointer"
                        />
                    )}
                </li>
                <li>
                    <IoMdSettings
                        size={24}
                        onClick={onSettings}
                        className="hover:cursor-pointer"
                    />
                </li>
                <li>
                    <MdFullscreen
                        size={26}
                        onClick={onFullScreen}
                        className="hover:cursor-pointer"
                    />
                </li>
                <li>
                    <BsThreeDotsVertical
                        size={20}
                        className="hover:cursor-pointer"
                        onClick={onControl}
                    />
                </li>
            </ul>
        </nav>
    );
};
export default Navbar;
