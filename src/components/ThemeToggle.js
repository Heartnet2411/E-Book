// src/components/ThemeToggle.js
import React, { useEffect, useState } from 'react';
import { IoMdSunny, IoMdMoon } from 'react-icons/io';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    // Kiểm tra thiết lập theme khi component mount
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else if (storedTheme === 'light') {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        } else {
            // Nếu không có theme trong localStorage, dựa vào hệ thống
            const prefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches;
            setDarkMode(prefersDark);
            if (prefersDark) {
                document.documentElement.classList.add('dark');
            }
        }
    }, []);

    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setDarkMode(!darkMode);
    };
    return (
        <button onClick={toggleTheme} className="focus:outline-none ml-4">
            {darkMode ? (
                <IoMdSunny size={28} color="white" />
            ) : (
                <IoMdMoon size={28} color="black" />
            )}
        </button>
    );
};

export default ThemeToggle;
