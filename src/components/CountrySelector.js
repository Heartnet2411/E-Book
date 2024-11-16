import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

function CountrySelector({
    countries,
    selectedCountries,
    setSelectedCountries,
    clearSelected,
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCountryChange = (country) => {
        if (selectedCountries.includes(country)) {
            setSelectedCountries(
                selectedCountries.filter((c) => c !== country)
            );
        } else {
            setSelectedCountries([...selectedCountries, country]);
        }
    };

    useEffect(() => {
        if (clearSelected) {
            setIsDropdownOpen(false);
        }
    }, [clearSelected, setSelectedCountries]);

    return (
        <div className="flex-1 ml-2 relative">
            <label className="block text-lg font-medium text-gray-700 dark:text-white">
                Quốc gia
            </label>
            <div
                onClick={toggleDropdown}
                className="px-4 relative py-2 mt-1 block w-full border bg-white border-gray-300 rounded-xl shadow-sm cursor-pointer dark:text-white dark:bg-gray-700 dark:border-gray-900"
            >
                <span>-- Chọn quốc gia --</span>
                <div className="text-gray-700 dark:text-white absolute right-0 top-1/2 -translate-y-1/2">
                    <MdKeyboardArrowDown size={20} />
                </div>
            </div>

            {isDropdownOpen && (
                <div className="absolute z-10 left-0 right-0 mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-lg bg-white dark:bg-gray-700 dark:border-gray-900 max-h-72 overflow-y-auto">
                    {countries.map((country) => (
                        <div key={country} className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                id={`country-${country}`}
                                value={country}
                                checked={selectedCountries.includes(country)}
                                onChange={() => handleCountryChange(country)}
                                className="mr-2"
                            />
                            <label
                                htmlFor={`country-${country}`}
                                className="text-base dark:text-white"
                            >
                                {country}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CountrySelector;
