/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,jsx,ts,tsx}', // Đảm bảo Tailwind quét tất cả các file trong thư mục src
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};