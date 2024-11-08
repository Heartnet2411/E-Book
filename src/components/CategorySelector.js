import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

function CategorySelector({
    categories,
    selectedCategories,
    setSelectedCategories,
    clearSelected, // Thêm prop để lắng nghe yêu cầu xóa lựa chọn
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCategoryChange = (categoryId) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(
                selectedCategories.filter((id) => id !== categoryId)
            );
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    // Đóng dropdown và xóa lựa chọn khi clearSelected thay đổi
    useEffect(() => {
        if (clearSelected) {
            setIsDropdownOpen(false); // Đóng dropdown
            setSelectedCategories([]); // Xóa tất cả lựa chọn
        }
    }, [clearSelected, setSelectedCategories]);

    return (
        <div className="flex-1 mr-2 relative">
            <label className="block text-lg font-medium text-gray-700 dark:text-white">
                Thể loại
            </label>
            {/* Button to toggle dropdown */}
            <div
                onClick={toggleDropdown}
                className="px-4 relative py-2 mt-1 block w-full border bg-white border-gray-300 rounded-xl shadow-sm cursor-pointer dark:text-white dark:bg-gray-700 dark:border-gray-900"
            >
                <span>-- Chọn thể loại --</span>
                <div className="text-gray-700 dark:text-white absolute right-0 top-1/2 -translate-y-1/2">
                    <MdKeyboardArrowDown size={20} />
                </div>
            </div>

            {/* Dropdown list */}
            {isDropdownOpen && (
                <div className="absolute z-10 left-0 right-0 mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-lg bg-white dark:bg-gray-700 dark:border-gray-900 max-h-72 overflow-y-auto">
                    {categories.map((category) => (
                        <div
                            key={category.categoryId}
                            className="flex items-center mb-1"
                        >
                            <input
                                type="checkbox"
                                id={`category-${category.categoryId}`}
                                value={category.categoryId}
                                checked={selectedCategories.includes(
                                    category.categoryId
                                )}
                                onChange={() =>
                                    handleCategoryChange(category.categoryId)
                                }
                                className="mr-2"
                            />
                            <label
                                htmlFor={`category-${category.categoryId}`}
                                className="text-base dark:text-white"
                            >
                                {category.name}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategorySelector;
