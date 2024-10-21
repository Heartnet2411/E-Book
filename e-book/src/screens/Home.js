import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Book from '../components/Book';
import BookMin from '../components/BookMin';
import { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import '../Home.css';
import SkeletonBook from '../components/SkeletonBook';
import { useNavigate, useLocation } from 'react-router-dom';
import BookSearch from '../components/BookSearch';
import { url } from '../config/config';

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`slick-arrow ${className} mr-16`}
            style={{ ...style }}
            onClick={onClick}
        >
            <IoIosArrowForward
                className="text-black dark:text-white"
                size={40}
            />
        </div>
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`arrow ${className} ml-16`}
            style={{ ...style }}
            onClick={onClick}
        >
            <IoIosArrowBack className="text-black dark:text-white" size={40} />
        </div>
    );
};
export default function Home() {
    const user = JSON.parse(localStorage.getItem('user'));

    var setting = {
        // dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow: <NextArrow to="next" />,
        prevArrow: <PrevArrow to="prev" />,
    };

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(true);
    const [bookSearchs, setBookSearchs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        axios
            .get(url + `/book`)
            .then((res) => {
                console.log(res.data);
                setBooks(res.data);
                setLoading(false);
            })
            .catch((err) => console.log(err));
    }, []);
    const handleSearch = (searchTerm) => {
        setLoadingSearch(true);
        setSearchTerm(searchTerm);
        console.log(searchTerm);
        axios
            .get(url + `/book/search?search=${searchTerm}`)
            .then((response) => {
                setBookSearchs(response.data);
                setLoadingSearch(false);

                console.log(response.data.results);
            })
            .catch((error) => {
                console.error('Error searching books:', error);
                setLoadingSearch(false);
            });
        navigate(`/?search=${searchTerm}`);
    };
    console.log(bookSearchs);
    return (
        <div
            className="bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black"
        >
            <Header user={user} onClickSearch={handleSearch} />
            <div className="popular px-8 mt-16 ">
                <div>
                    {searchTerm ? (
                        <BookSearch
                            books={bookSearchs}
                            searchTerm={searchTerm}
                            loadingSearch={loadingSearch}
                            setLoadingSearch={setLoadingSearch}
                        />
                    ) : (
                        <>
                            <div className="title text-black dark:text-white font-semibold text-6xl px-8 text-left ">
                                Đọc nhiều trong tuần
                            </div>
                            <Slider {...setting} className="px-20 mt-8">
                                {loading
                                    ? Array.from({ length: 5 }).map(
                                          (_, index) => (
                                              <SkeletonBook
                                                  key={index}
                                                  className="flex-shrink-0 w-1/5"
                                              />
                                          )
                                      )
                                    : books.map((book) => (
                                          <Book
                                              className="flex-shrink-0 w-1/5"
                                              book={book}
                                              key={book.id}
                                          />
                                      ))}
                            </Slider>
                            <div className="recommend px-8 mt-8">
                                <div className="title text-black dark:text-white font-semibold text-4xl px-8">
                                    Đề xuất cho bạn
                                </div>
                                <Slider {...setting} className="px-28">
                                    {loading
                                        ? Array.from({ length: 5 }).map(
                                              (_, index) => (
                                                  <SkeletonBook
                                                      key={index}
                                                      className="flex-shrink-0 w-1/5"
                                                  />
                                              )
                                          )
                                        : books.map((book) => (
                                              <Book
                                                  className="flex-shrink-0 w-1/5"
                                                  book={book}
                                                  key={book.id}
                                              />
                                          ))}
                                </Slider>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
