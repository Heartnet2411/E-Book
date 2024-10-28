import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className=" dark:text-white text-black  py-16 mt-4">
            <div className="container mx-auto flex justify-center gap-8">
                {/* Cột 1: Về chúng tôi */}
                <div className="w-1/5">
                    <h3 className="text-2xl font-semibold mb-4">
                        Về chúng tôi
                    </h3>
                    <ul>
                        <li className="">
                            <a
                                href="/"
                                className=" hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                            >
                                Giới thiệu
                            </a>
                        </li>
                        <li className="mt-1">
                            <a
                                href="/"
                                className="hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                            >
                                Lĩnh vực hoạt động
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Cột 2: Liên kết nhanh */}
                <div className="w-1/5">
                    <h3 className="text-2xl font-semibold mb-4">
                        Liên kết nhanh
                    </h3>
                    <ul>
                        <li className="hover:text-white">
                            <a
                                href="/"
                                className=" hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                            >
                                Sách điện tử
                            </a>
                        </li>
                        <li className="mt-1">
                            <a
                                href="/"
                                className=" mt-1 hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                            >
                                Sách nói
                            </a>
                        </li>
                        <li className="mt-1">
                            <a
                                href="/"
                                className=" hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                            >
                                Diễn đàn
                            </a>
                        </li>
                        <li className="mt-1">
                            <a
                                href="/"
                                className=" hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                            >
                                Podcast
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Cột 3: Liên hệ */}
                <div className="w-1/5">
                    <h3 className="text-2xl font-semibold mb-4">Liên hệ</h3>
                    <p className="  text-gray-500 dark:text-gray-400 ">
                        Email: support@sachviet.com
                    </p>
                    <p className="  text-gray-500 dark:text-gray-400 mt-1">
                        Điện thoại: +84 123 456 789
                    </p>
                    <p className="  text-gray-500 dark:text-gray-400 mt-1">
                        Địa chỉ: 123 Đường Sách, Quận 1,
                    </p>
                </div>

                {/* Cột 4: Mạng xã hội */}
                <div className="w-1/5">
                    <h3 className="text-2xl font-semibold mb-4">
                        Kết nối với chúng tôi
                    </h3>
                    <div className="flex space-x-4">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" hover:text-gray-600 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                        >
                            <FaFacebook className="text-2xl " />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                        >
                            <FaTwitter className="text-2xl " />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                        >
                            <FaInstagram className="text-2xl" />
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" hover:text-gray-700 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                        >
                            <FaYoutube className="text-2xl" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center">
                <p>&copy; Nguyễn Văn Thuận - Lê Thế Vinh</p>
                <p>
                    &copy; Đồ án tốt nghiệp khoa Kỹ thuật phần mềm - Trường Đại
                    học Công Nghiệp TPHCM
                </p>
            </div>
        </footer>
    );
};

export default Footer;
