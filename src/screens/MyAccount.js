import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import { MdEdit, MdEditOff } from 'react-icons/md';
import axios from 'axios';
import { url } from '../config/config';
import SkeletonBook from '../components/SkeletonBook';
import Book from '../components/Book';
import Lottie from 'react-lottie';
import loadingAnimation from '../lotties/login.json';
import { Link } from 'react-router-dom';
import { FaCameraRotate } from 'react-icons/fa6';
import { toast, Slide } from 'react-toastify';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

function MyAccount() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatar, setAvatar] = useState(user.avatar);
    const [background, setBackground] = useState(user.background);
    const [edit, setEdit] = useState(true);
    const [activeTab, setActiveTab] = useState('personal-info');
    const [SavedBook, setSavedBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Xóa lỗi khi người dùng thay đổi input
    };

    const validateForm = () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // Regex kiểm tra mật khẩu
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
        } else if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword =
                'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 số.';
        } else if (formData.currentPassword === formData.newPassword)
            newErrors.newPassword = 'Mật khẩu mới phải khác với mật khẩu cũ.';
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
        } else if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await fetch(url + '/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Thay đổi nếu token được lưu ở nơi khác
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (response.ok) {
                toast.success('Đổi mật khẩu thành công!', {
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
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setSubmitError('');
            } else {
                const data = await response.json();
                console.log(data);
                setSubmitError(
                    data.message || 'Đã xảy ra lỗi khi thay đổi mật khẩu.'
                );
            }
        } catch (error) {
            setSubmitError('Đã xảy ra lỗi khi kết nối tới máy chủ.');
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setDateOfBirth(user.dateOfBirth || '');
            setGender(user.gender); // Lưu trực tiếp kiểu boolean
            setPhoneNumber(user.phoneNumber || '');
        }
        fetchSavedBook();
    }, []);

    const fetchSavedBook = async () => {
        // Gọi API để lấy sách đã lưu
        try {
            const response = await axios.get(url + `/book/saved/saved-books`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Hoặc cách nào khác để lấy token
                },
            });
            console.log(response.data);
            setSavedBook(response.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            const data = {
                gender: gender, // Đã lưu trực tiếp kiểu boolean
                firstName,
                lastName,
                dateOfBirth,
                phoneNumber,
            };

            const response = await axios.put(
                `${url}/user/update-userinfo`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedUser = {
                ...user,
                ...data,
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setFirstName(updatedUser.firstName);
            setLastName(updatedUser.lastName);
            setGender(updatedUser.gender); // Lưu trực tiếp kiểu boolean
            setDateOfBirth(updatedUser.dateOfBirth);
            setPhoneNumber(updatedUser.phoneNumber);
            setEdit(true);

            toast.success('Cập nhật thông tin thành công!', {
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
        } catch (error) {
            toast.error('Cập nhật thông tin thất bại! Vui lòng thử lại sau', {
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
        }
    };

    const loadingOption = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setIsCropping(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleAvatarChange = async (e) => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

        // Tạo form data để gửi ảnh
        const formData = new FormData();
        formData.append('file', croppedImage, 'cropped-image.jpg');

        try {
            const response = await axios.post(
                url + `/user/upload/avatar`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const updatedAvatar = response.data.avatarUrl; // URL trả về từ server
            setAvatar(updatedAvatar);

            const updatedUser = {
                ...user,
                avatar: updatedAvatar,
            };
            setIsCropping(false);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast.success('Cập nhật ảnh đại diện thành công!', {
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
        } catch (error) {
            setIsCropping(false);
            toast.error(
                'Cập nhật ảnh đại diện thất bại! Vui lòng thử lại sau',
                {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                    transition: Slide,
                }
            );
        }
    };

    const handleBackgroundChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                url + `/user/upload/background`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const updatedBackground = response.data.backgroundUrl; // URL trả về từ server
            setBackground(updatedBackground);

            const updatedUser = {
                ...user,
                background: updatedBackground,
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast.success('Cập nhật background thành công!', {
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
        } catch (error) {
            toast.error('Cập nhật background thất bại! Vui lòng thử lại sau', {
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
        }
    };

    const handleCancel = () => {
        setIsCropping(false); // Đóng Cropper
        setImageSrc(null); // Xóa ảnh cũ
    };

    return (
        <div
            className="bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-slate-900 dark:to-black min-h-screen"
        >
            <Header user={user} />
            {user ? (
                <div className="px-16">
                    <div className="mx-auto ">
                        <div className="flex justify-center relative">
                            <img
                                src={background}
                                className="w-4/5 h-56 object-cover rounded-b-2xl"
                                alt="user backround img "
                            />

                            <label className="absolute bottom-2 right-56 bg-gray-200 dark:bg-gray-700 opacity-70 p-2 rounded-xl cursor-pointer ">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleBackgroundChange}
                                />
                                <span className="text-black dark:text-white flex items-center justify-between px-2 z-20 cursor-pointer">
                                    <FaCameraRotate
                                        size={22}
                                        className=" cursor-pointer"
                                    />
                                    {/* Thay đổi ảnh bìa */}
                                </span>
                            </label>

                            <div className="absolute bottom-0 w-3/5 translate-y-1/2 flex justify-between items-end">
                                <img
                                    src={user.avatar}
                                    className="w-40 h-40 object-cover rounded-full bg-white"
                                    alt="user avatar img"
                                />
                                <label className="absolute bottom-0 left-0 bg-gray-300 dark:bg-gray-700 p-2 rounded-full cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <span className="text-black dark:text-white">
                                        <FaCameraRotate size={24} />
                                    </span>
                                </label>
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-black dark:text-white ml-4 flex-1">
                                        <p className="font-bold text-3xl">
                                            {user.firstName +
                                                ' ' +
                                                user.lastName}
                                        </p>
                                        {/* <p className="font-medium text-lg">
                                        0 người theo dõi
                                    </p> */}
                                    </div>
                                    {activeTab === 'personal-info' &&
                                        (edit ? (
                                            <button
                                                onClick={() => setEdit(!edit)}
                                                className="flex items-center text-black dark:text-white bg-gray-300 dark:bg-gray-700 p-2 px-4 rounded-xl"
                                            >
                                                <MdEdit size={24} />
                                                <span className="font-semibold text-lg ml-2">
                                                    Chỉnh sửa thông tin
                                                </span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setEdit(!edit)}
                                                className="flex items-center text-black dark:text-white bg-gray-300 dark:bg-gray-700 p-2 px-4 rounded-xl"
                                            >
                                                <MdEditOff size={24} />
                                                <span className="font-semibold text-lg ml-2">
                                                    Hủy chỉnh sửa
                                                </span>
                                            </button>
                                        ))}

                                    {!edit ? (
                                        <button
                                            onClick={handleSave}
                                            className="font-semibold text-lg px-8 py-2 bg-blue-600 rounded-xl ml-2 text-white"
                                        >
                                            {' '}
                                            Lưu
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            {isCropping ? (
                                <div className="crop-container">
                                    <Cropper
                                        image={imageSrc}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                    <div className="absolute right-1/2 translate-x-1/2 bottom-0">
                                        <button
                                            className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
                                            onClick={handleAvatarChange}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className="mt-28 grid grid-cols-10 w-4/5 mx-auto  gap-4  ">
                            <div className="col-span-3 p-4 bg-gray-100 rounded-xl h-max border border-gray-200 dark:bg-gray-800 dark:border-gray-600">
                                <ul className="list-none p-4 space-y-2  rounded-md ">
                                    <li
                                        className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer dark:border-gray-600 ${
                                            activeTab === 'personal-info'
                                                ? 'bg-gray-200 dark:bg-gray-600'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setActiveTab('personal-info')
                                        }
                                    >
                                        <a
                                            href="#personal-info"
                                            className="text-gray-700 font-medium dark:text-gray-200"
                                        >
                                            Thông tin cá nhân
                                        </a>
                                    </li>

                                    <li
                                        className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer dark:border-gray-600 ${
                                            activeTab === 'saved-books'
                                                ? 'bg-gray-200  dark:bg-gray-600'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setActiveTab('saved-books')
                                        }
                                    >
                                        <a
                                            href="#saved-books"
                                            className="text-gray-700 font-medium dark:text-gray-200"
                                        >
                                            Sách đã lưu
                                        </a>
                                    </li>

                                    <li
                                        className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer dark:border-gray-600 ${
                                            activeTab === 'change-password'
                                                ? 'bg-gray-200  dark:bg-gray-600'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setActiveTab('change-password')
                                        }
                                    >
                                        <a
                                            href="#change-password"
                                            className="text-gray-700 font-medium dark:text-gray-200"
                                        >
                                            Đổi mật khẩu
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {activeTab === 'personal-info' && (
                                <div className="col-span-7 p-4 bg-gray-100 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-600">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-1">
                                            <label className="block text-gray-800">
                                                Họ
                                            </label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                className="w-full p-3 border rounded-xl bg-gray-50 text-black dark:text-white dark:bg-gray-900 dark:border-gray-600"
                                                disabled={edit}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-gray-800">
                                                Tên
                                            </label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                className="w-full p-3 border rounded-xl bg-gray-50 text-black dark:text-white dark:bg-gray-900 dark:border-gray-600"
                                                disabled={edit}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <label className="block text-gray-800">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                className="w-full p-3 border rounded-xl bg-gray-50 text-black dark:text-white dark:bg-gray-900 dark:border-gray-600"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-gray-800">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="text"
                                                value={phoneNumber}
                                                className="w-full p-3 border rounded-xl bg-gray-50 text-black dark:text-white dark:bg-gray-900 dark:border-gray-600"
                                                disabled={edit}
                                                onChange={(e) =>
                                                    setPhoneNumber(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-span-1">
                                            <label className="block text-gray-800">
                                                Giới tính
                                            </label>
                                            {edit ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        gender ? 'Nam' : 'Nữ'
                                                    } // Hiển thị dạng chuỗi
                                                    className="w-full p-3 border rounded-xl bg-gray-50 text-black dark:text-white dark:bg-gray-900 dark:border-gray-600"
                                                    disabled
                                                />
                                            ) : (
                                                <select
                                                    value={gender ? 1 : 0} // Chuyển đổi boolean thành số cho `select`
                                                    className="w-full p-3 border rounded-xl bg-gray-50 text-black dark:text-white dark:bg-gray-900 dark:border-gray-600"
                                                    onChange={(e) =>
                                                        setGender(
                                                            Boolean(
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        )
                                                    }
                                                >
                                                    <option value={0}>
                                                        Nữ
                                                    </option>
                                                    <option value={1}>
                                                        Nam
                                                    </option>
                                                </select>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-gray-800">
                                                Ngày sinh
                                            </label>
                                            <input
                                                type="date"
                                                value={dateOfBirth}
                                                className="w-full p-3 border rounded-xl bg-gray-50 text-black dark:text-white dark:bg-gray-900 dark:border-gray-600"
                                                disabled={edit}
                                                onChange={(e) =>
                                                    setDateOfBirth(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'saved-books' && (
                                <div className="col-span-7 py-2">
                                    <div className="grid grid-cols-3 gap-4 ">
                                        {loading
                                            ? Array.from({ length: 3 }).map(
                                                  (_, index) => (
                                                      <SkeletonBook
                                                          key={index}
                                                          className="flex-shrink-0 w-1/5"
                                                      />
                                                  )
                                              )
                                            : SavedBook.map((book) => (
                                                  <Book
                                                      className="flex-shrink-0 w-1/5"
                                                      book={book.Book}
                                                      key={book.id}
                                                  />
                                              ))}
                                    </div>
                                    {SavedBook.length === 0 ? (
                                        <div className="text-center w-full dark:text-gray-400 text-gray-700 text-xl font-medium">
                                            <i>Bạn chưa lưu sách nào</i>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                            {activeTab === 'change-password' && (
                                <div className="col-span-7 py-2">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block mb-2 text-gray-700 dark:text-gray-300">
                                                Mật khẩu hiện tại
                                            </label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:text-white"
                                            />
                                            {errors.currentPassword && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.currentPassword}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 dark:text-gray-300">
                                                Mật khẩu mới
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:text-white"
                                            />
                                            {errors.newPassword && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.newPassword}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 dark:text-gray-300">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-xl dark:bg-gray-700 dark:text-white"
                                            />
                                            {errors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.confirmPassword}
                                                </p>
                                            )}
                                        </div>

                                        {submitError && (
                                            <p className="text-red-500 text-sm mt-2">
                                                {submitError}
                                            </p>
                                        )}

                                        <button
                                            type="submit"
                                            className="w-full p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                                        >
                                            Đổi mật khẩu
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full text-center text-xl font-medium dark:text-white">
                    <Lottie options={loadingOption} height="100%" width="35%" />
                    <span>
                        Hãy{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 underline decoration-solid"
                        >
                            đăng nhập
                        </Link>{' '}
                        để thực hiện chức năng trên
                    </span>
                </div>
            )}
        </div>
    );
}

export default MyAccount;
