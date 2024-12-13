import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import loginanimation from '../lotties/register.json';
import { FaYahoo } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoMdEye } from 'react-icons/io';
import { IoEyeOff } from 'react-icons/io5';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';
import { toast, Slide } from 'react-toastify';
import { url } from '../config/config';

const Login = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !password) {
            setModalMessage('Vui lòng nhập thông tin đăng nhập!');
            setShowModal(true);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(url + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const result = await response.json();
            console.log(result);

            if (!response.ok) {
                throw new Error('Đăng nhập thất bại: ' + result.message);
            }

            console.log('Đăng nhập thành công');
            setModalMessage('Đăng nhập thành công!');
            setShowModal(true);

            // Xử lý tiếp theo sau khi đăng nhập thành công, ví dụ: lưu token hoặc chuyển hướng
            localStorage.setItem('token', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('user', JSON.stringify(result.user));

            navigate('/');
        } catch (error) {
            setModalMessage('Có lỗi xảy ra khi đăng nhập: ' + error.message);
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            // Đăng nhập với Google
            const result = await signInWithPopup(auth, googleProvider);

            // Lấy thông tin người dùng
            const user = result.user;
            console.log('User info:', user);

            return user; // Trả về thông tin người dùng
        } catch (error) {
            console.error('Error during Google login:', error);
            throw error;
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const user = await loginWithGoogle();
            const response = await fetch(url + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: '',
                }),
            });

            const result = await response.json();
            console.log(result);

            if (!response.ok) {
                throw new Error('Đăng nhập thất bại: ' + result.message);
            }

            toast.success('Đăng nhập thành công!', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Slide,
            });

            // Xử lý tiếp theo sau khi đăng nhập thành công, ví dụ: lưu token hoặc chuyển hướng
            localStorage.setItem('token', result.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate('/');
        } catch (error) {
            alert('Đăng nhập thất bại. Vui lòng thử lại.');
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
            <div className="max-w-screen-2xl grid grid-cols-2 grid-rows-[20vh_40vh_40vh]  px-16  max-h-screen">
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
                <div className="row-start-2 w-auto h-full flex align-top justify-start">
                    <div className="mt-auto mb-auto flex align-top">
                        <Lottie
                            options={defaultOptions}
                            height="80%"
                            width="80%"
                        />
                    </div>
                </div>
                <div className="row-start-2 w-auto  px-12">
                    <h1 className="text-7xl leading-loose font-bold text-white ">
                        Đăng nhập
                    </h1>
                    <div className="flex flex-col w-10/12 mb-4 mt-2">
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 focus:outline-none "
                        />
                        <div className="relative my-2">
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
                    </div>
                    <p className="text-white mb-4">
                        Chưa có tài khoản?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 underline decoration-solid"
                        >
                            Đăng ký.
                        </Link>
                    </p>
                    <button
                        disabled={isLoading}
                        onClick={handleLogin}
                        className=" w-10/12 px-6 py-2 rounded-2xl bg-blue-500 hover:bg-sky-600 mt-4 text-white font-medium text-xl"
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                    <div className="w-10/12 flex items-center my-8">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <p className="px-4 text-center text-gray-500">
                            hoặc đăng nhập với
                        </p>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className=" w-10/12 flex space-x-4 justify-around">
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
                    {/* Hiển thị modal nếu showModal là true */}
                    {showModal && (
                        <Notification
                            message={modalMessage}
                            onClose={() => setShowModal(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
