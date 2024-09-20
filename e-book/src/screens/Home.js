import axios from 'axios';
import Header from '../components/Header';
import Book from '../components/Book';
import { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
//import home.css
import '../Home.css';

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`slick-arrow ${className}`}
            style={{ ...style }}
            onClick={onClick}
        >
           <IoIosArrowForward color='white' size={40}/>
            </div>
    );
};
const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`arrow ${className}`}
            style={{ ...style }}
            onClick={onClick}
        >
           <IoIosArrowBack color='white' size={40}/>
            </div>
    );
};

export default function Home() {
    var setting={
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll:3,
        nextArrow: <NextArrow to="next"/>,
        prevArrow: <PrevArrow to="prev"/>,
    }
    const [books, setBooks] = useState([]);
    useEffect(() => {
        axios
            .get(
                'https://www.googleapis.com/books/v1/volumes?q=javascrpit&key=AIzaSyBEeDBvkeeH0nFc_-0w9dbdOv9M0LfT9sA'
            )
            .then((res) => setBooks(res.data.items))
            .catch((err) => console.log(err));
    }, []);
    console.log(books);
    return (
        <div
            style={{
                background:
                    'linear-gradient(0deg, #2b2738 0%, #2f2a3f 50%, #24202e 100%)',
            }}
        >
            <Header />
            <div className="popular p-8 ">
                <div className="title text-gray-400 text-6xl px-8">
                    Đọc nhiều trong tuần
                </div>
                <Slider {...setting}>
                    {books.map((book) => (
                        <Book className="flex-shrink-0 w-1/5" book={book} key={book.id} />
                    ))}
                </Slider>

                </div>
            <div className="recommend p-8">
    <div className="title text-gray-400 text-4xl px-8">
        Đề xuất cho bạn
    </div>
        <Slider {...setting} >
        {books.map((book) => (
            <Book book={book} key={book.id} />
        ))}
        </Slider>
</div>
<div className="p-8">
    <div className="title text-gray-400 text-4xl px-8">
       Sách đời sống
    </div>
    <Slider {...setting}>
        {books.map((book) => (
            <Book book={book} key={book.id} />
        ))}
        </Slider>
</div>
<div className="p-8">
    <div className="title text-gray-400 text-4xl px-8">
       Sách khoa học
    </div>
    <Slider {...setting}>
    {books.map((book) => (
        <Book book={book} key={book.id} />
    ))}
    </Slider>
</div>
        </div>
    );
}
