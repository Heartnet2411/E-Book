import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import loginanimation from '../lotties/register.json';
import { FaFacebookSquare } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoMdEye } from 'react-icons/io';
import { IoEyeOff } from 'react-icons/io5';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

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

    return (
        <div
            style={{
                background:
                    'linear-gradient(0deg, #2b2738 0%, #191721 50%, #181620 100%)',
            }}
            className="grid grid-cols-2 grid-rows-[20vh_40vh_40vh]  px-16 bg-[#2B2738] max-h-screen"
        >
            <div className="col-span-2 h-auto">
                <div className="h-1/5">
                    <img
                        src="..\..\TheBookLounge.png"
                        alt="Logo"
                        height="10%"
                        width="10%"
                        className="ml-auto mr-auto"
                    />
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
                            className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 focus:outline-none mr-4"
                        />
                        <input
                            type="text"
                            placeholder="tên"
                            className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 focus:outline-none ml-4"
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="email"
                        className="border-white w-full px-6 py-2 rounded-2xl bg-slate-200 focus:outline-none "
                    />
                    <div className="relative ">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="mật khẩu"
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

                <button className="ml-20 w-10/12 px-6 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 mt-4 text-white font-medium text-xl">
                    Đăng ký
                </button>

                <div className="w-10/12 flex items-center my-4 ml-20">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <p className="px-4 text-center text-gray-500">
                        hoặc đăng nhập với
                    </p>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className=" w-10/12 flex space-x-4 justify-around ml-20">
                    <button className="bg-blue-600 py-2 px-4 rounded-xl hover:bg-blue-700 flex items-center w-1/3 justify-center">
                        <FaFacebookSquare color="white" size={24} />
                        <p className="text-white ml-2 text-xl font-medium ">
                            Facebook
                        </p>
                    </button>
                    <button className="bg-white text-white py-2 px-4 rounded-xl hover:bg-red-700 flex items-center w-1/3 justify-center">
                        <FcGoogle size={24} />
                        <p className="text-black ml-2 font-medium text-xl">
                            Google
                        </p>
                    </button>
                </div>
            </div>

            <div className="row-start-2 w-auto h-full flex align-top justify-start">
                <div className="mt-auto mb-auto">
                    <Lottie options={defaultOptions} height="85%" width="85%" />
                </div>
            </div>
        </div>
    );
};

export default Login;
