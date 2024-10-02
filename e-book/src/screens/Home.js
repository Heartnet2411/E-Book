import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Book from '../components/Book';
import BookMin from '../components/BookMin';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import '../Home.css';
import { GOOGLE_API_KEY } from '../config/config';

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

    useEffect(() => {
        axios
            .get(
                `https://www.googleapis.com/books/v1/volumes?q=Lập+trình+web&key=${GOOGLE_API_KEY}`
            )
            .then((res) => setBooks(res.data.items))
            .catch((err) => console.log(err));
    }, []);
    console.log(books);

    return (
        <div
            className="bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black"
        >
            <Header />
            <div className="popular px-8 mt-16 ">
                <div className="title text-black dark:text-white font-semibold text-6xl px-8 text-center">
                    Đọc nhiều trong tuần
                </div>
                <Slider {...setting} className="px-20 mt-8">
                    {books.map((book) => (
                        <Book
                            className="flex-shrink-0 w-1/5"
                            book={book}
                            key={book.id}
                        />
                    ))}
                </Slider>
            </div>
            <div className="recommend px-8 mt-8">
                <div className="title text-black dark:text-white font-semibold text-4xl px-8">
                    Đề xuất cho bạn
                </div>
                <Slider {...setting} className="px-28">
                    {books.map((book) => (
                        <BookMin book={book} key={book.id} />
                    ))}
                </Slider>
            </div>
            <div className="px-8 mt-8">
                <div className="title text-black dark:text-white font-semibold text-4xl px-8">
                    Sách đời sống
                </div>
                <Slider {...setting} className="px-28">
                    {books.map((book) => (
                        <BookMin book={book} key={book.id} />
                    ))}
                </Slider>
            </div>
            <div className="px-8 mt-8">
                <div className="title text-black dark:text-white font-semibold text-4xl px-8">
                    Sách khoa học
                </div>
                <Slider {...setting} className="px-28">
                    {books.map((book) => (
                        <BookMin book={book} key={book.id} />
                    ))}
                </Slider>
            </div>

            <Footer />
        </div>
    );
}
