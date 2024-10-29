import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Book from '../components/Book';

import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import '../Home.css';
import SkeletonBook from '../components/SkeletonBook';

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
    const [literatureBooks, setLiteratureBooks] = useState([]);
    const [scienceBooks, setScienceBooks] = useState([]);
    const [historyBooks, setHistoryBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBook = () => {
        axios
            .get(url + `/book/search?page=2`)
            .then((res) => {
                setBooks(res.data.books);
            })
            .catch((err) => console.log(err));
        axios
            .get(
                url +
                    `/book/search?page=1&categoryId=1bccf7dd-a793-4614-bd2e-661275fbb338`
            )
            .then((res) => {
                setLiteratureBooks(res.data.books);
            })
            .catch((err) => console.log(err));
        axios
            .get(
                url +
                    `/book/search?page=1&categoryId=2ff820ac-b572-4a93-b2c2-811301b08d44`
            )
            .then((res) => {
                setScienceBooks(res.data.books);
                setLoading(false);
            })
            .catch((err) => console.log(err));
        axios
            .get(
                url +
                    `/book/search?page=1&categoryId=730f08f7-4a14-4f74-b0b6-5cca802190a0`
            )
            .then((res) => {
                setHistoryBooks(res.data.books);
                setLoading(false);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        const loadData = new Promise(() => {
            fetchBook();
        });

        loadData
            .then(() => {
                setLoading(false); // Cập nhật trạng thái khi Promise hoàn thành
            })
            .catch((error) => {
                console.error('Error loading data:', error);
            });
    }, []);

    return (
        <div
            className="bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black"
        >
            <Header user={user} />
            <div className="popular px-8 mt-16 max-w-screen-2xl mx-auto">
                <div>
                    <>
                        <div className="title text-black dark:text-white font-semibold text-6xl px-8 text-center ">
                            Đọc nhiều trong tuần
                        </div>
                        <Slider {...setting} className="px-20 mt-8">
                            {loading
                                ? Array.from({ length: 5 }).map((_, index) => (
                                      <SkeletonBook
                                          key={index}
                                          className="flex-shrink-0 w-1/5"
                                      />
                                  ))
                                : books.map((book) => (
                                      <Book
                                          className="flex-shrink-0 w-1/5"
                                          book={book}
                                          key={book.id}
                                      />
                                  ))}
                        </Slider>
                        <div className="recommend px-8 mt-10">
                            <div className="title text-black dark:text-white font-semibold text-4xl px-8 mb-4">
                                Sách Văn Học Việt Nam
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
                                    : literatureBooks.map((book) => (
                                          <Book
                                              className="flex-shrink-0 w-1/5"
                                              book={book}
                                              key={book.id}
                                          />
                                      ))}
                            </Slider>
                        </div>
                        <div className="recommend px-8 mt-6">
                            <div className="title text-black dark:text-white font-semibold text-4xl px-8 mb-4">
                                Sách Khoa Học
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
                                    : scienceBooks.map((book) => (
                                          <Book
                                              className="flex-shrink-0 w-1/5"
                                              book={book}
                                              key={book.id}
                                          />
                                      ))}
                            </Slider>
                        </div>
                        <div className="recommend px-8 mt-6">
                            <div className="title text-black dark:text-white font-semibold text-4xl px-8 mb-4">
                                Sách Lịch Sử
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
                                    : historyBooks.map((book) => (
                                          <Book
                                              className="flex-shrink-0 w-1/5"
                                              book={book}
                                              key={book.id}
                                          />
                                      ))}
                            </Slider>
                        </div>
                    </>
                </div>
            </div>
            <Footer />
        </div>
    );
}
