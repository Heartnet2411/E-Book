import React from 'react';
import Lottie from 'react-lottie';
import loadingAnimation from '../lotties/loading2.json';

const loadingOption = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

const SkeletonBook = () => {
    return (
        <div className="flex flex-col items-center  p-4 cursor-pointer">
            <div className="w-52 h-80 mb-2 rounded-lg bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                <Lottie options={loadingOption} height="50%" width="50%" />
            </div>
            <div className="w-52 h-12 bg-gray-200 rounded-lg dark:bg-gray-900"></div>
        </div>
    );
};

export default SkeletonBook;
