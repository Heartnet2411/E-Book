import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import loginanimation from '../lotties/register.json';
import { FaFacebookSquare } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoMdEye } from 'react-icons/io';
import { IoEyeOff } from 'react-icons/io5';
import Notification from '../components/Notification';
import { host, port } from '../utils/constatn';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../utils/firebase';

const Login = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loginanimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Regex cho định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Regex cho mật khẩu: ít nhất 8 ký tự, có ít nhất 1 chữ hoa và 1 số
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setModalMessage('Vui lòng điền đầy đủ thông tin!');
            setShowModal(true);
            setIsLoading(false);
            return;
        } else if (!emailRegex.test(email)) {
            setModalMessage('Định dạng email không hợp lệ!');
            setShowModal(true);
            setIsLoading(false);
            return;
        } else if (!passwordRegex.test(password)) {
            setModalMessage(
                'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa và 1 chữ số!'
            );
            setShowModal(true);
            setIsLoading(false);
            return;
        } else if (password !== confirmPassword) {
            setModalMessage('Mật khẩu và xác nhận mật khẩu không khớp!');
            setShowModal(true);
            setIsLoading(false);
            return;
        }

        // Kiểm tra xem email đã được sử dụng chưa

        try {
            // Đăng ký người dùng với email và password trong Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Gửi email xác thực
            await sendEmailVerification(userCredential.user);

            setModalMessage(
                'Vui lòng kiểm tra email của bạn để xác thực tài khoản.'
            );
            setShowModal(true);

            // Kiểm tra trạng thái xác thực của người dùng
            const checkVerification = setInterval(async () => {
                const user = auth.currentUser;

                if (user) {
                    await user.reload(); // Tải lại thông tin người dùng
                    if (user.emailVerified) {
                        console.log('Người dùng đã xác thực.');
                        // Tiếp tục với chức năng login
                        setShowModal(false);
                        userRegister();

                        clearInterval(checkVerification); // Ngừng kiểm tra
                    } else {
                        console.log('Người dùng chưa xác thực.');
                    }
                }
            }, 5000); // Kiểm tra mỗi 5 giây
        } catch (error) {
            setModalMessage('Có lỗi xảy ra khi đăng ký: ' + error.message);
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    //đăng ký với google
    const handleGoogleLogin = async () => {
        try {
            // Đăng nhập với tài khoản Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Lấy tên và email từ user object
            const displayName = user.displayName;
            const email = user.email;

            // Lưu thông tin người dùng vào state

            console.log('Tên:', displayName);
            console.log('Email:', email);
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            // Đăng nhập với tài khoản Facebook
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;

            // Lấy tên và email từ user object
            const displayName = user.displayName;
            const email = user.email;

            // Lưu thông tin người dùng vào state

            console.log('Tên:', displayName);
            console.log('Email:', email);
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
        }
    };

    const userRegister = async () => {
        try {
            // Gửi yêu cầu đến API với dữ liệu người dùng
            const response = await fetch(
                'http://' + host + ':' + port + '/api/user/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password,
                    }),
                }
            );

            // Kiểm tra xem API trả về kết quả thành công hay không
            const result = await response.json();

            if (response.ok) {
                setModalMessage('Đăng ký thành công!');
                setShowModal(true);
            } else {
                setModalMessage('Đăng ký thất bại: ' + result.message);
                setShowModal(true);
            }
        } catch (error) {
            setModalMessage('Có lỗi xảy ra khi đăng ký!');
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                background:
                    'linear-gradient(0deg, #2b2738 0%, #191721 50%, #181620 100%)',
            }}
            className="bg-[#2B2738] flex justify-center"
        >
            <div className="grid grid-cols-2 grid-rows-[15vh_42.5vh_42.5vh]  px-16  max-h-screen max-w-screen-2xl">
                <div className="col-span-2 h-auto">
                    <div className="h-1/5 cursor-pointer">
                        <Link to="/" className="h-1/5 cursor-pointer">
                            <img
                                src="..\..\TheBookLounge.png"
                                alt="Logo"
                                height="10%"
                                width="10%"
                                className="ml-auto mr-auto"
                            />
                        </Link>
                    </div>
                </div>
                <div className="row-start-2 w-auto  px-12">
                    <h1 className="text-5xl leading-loose font-bold text-white ml-20">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-white mb-4 ml-20">
                        Đã có tài khoản?{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 underline decoration-solid"
                        >
                            Đăng nhập ngay.
                        </Link>
                    </p>
                    <div className="flex flex-col w-10/12 mb-4 mt-2 ml-20">
                        <div className="flex mb-4">
                            <input
                                type="text"
                                placeholder="họ"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 focus:outline-none mr-4"
                            />
                            <input
                                type="text"
                                placeholder="tên"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 focus:outline-none ml-4"
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 focus:outline-none "
                        />
                        <div className="relative ">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 mt-4 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-5 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                {passwordVisible ? (
                                    <IoEyeOff size={30} />
                                ) : (
                                    <IoMdEye size={30} />
                                )}
                            </button>
                        </div>
                        <div className="relative ">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 mt-4 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-5 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                {passwordVisible ? (
                                    <IoEyeOff size={30} />
                                ) : (
                                    <IoMdEye size={30} />
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleRegister}
                        disabled={isLoading ? true : false}
                        className="ml-20 w-10/12 px-6 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 mt-4 text-white font-medium text-xl"
                    >
                        {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                    <div className="w-10/12 flex items-center my-4 ml-20">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <p className="px-4 text-center text-gray-500">
                            hoặc đăng nhập với
                        </p>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className=" w-10/12 flex space-x-4 justify-around ml-20">
                        <button
                            onClick={handleFacebookLogin}
                            className="bg-blue-600 py-2 px-4 rounded-xl hover:bg-blue-700 flex items-center w-1/3 justify-center"
                        >
                            <FaFacebookSquare color="white" size={24} />
                            <p className="text-white ml-2 text-xl font-medium ">
                                Facebook
                            </p>
                        </button>
                        <button
                            onClick={handleGoogleLogin}
                            className="bg-white text-white py-2 px-4 rounded-xl hover:bg-red-700 flex items-center w-1/3 justify-center"
                        >
                            <FcGoogle size={24} />
                            <p className="text-black ml-2 font-medium text-xl">
                                Google
                            </p>
                        </button>
                    </div>
                </div>
                <div className="row-start-2 w-auto h-full flex align-top justify-start">
                    <div className="mt-auto mb-auto">
                        <Lottie
                            options={defaultOptions}
                            height="85%"
                            width="85%"
                        />
                    </div>
                </div>
                {/* Hiển thị modal nếu showModal là true */}
                {showModal && (
                    <Notification
                        message={modalMessage}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Login;
