import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-country-flag";
import { IoIosArrowDown } from 'react-icons/io';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'EN', flagCode: 'US', fullName: 'English' },
    { code: 'es', name: 'ES', flagCode: 'ES', fullName: 'Español' },
  ];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-1 px-2 py-1 !bg-transparent text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none rounded-md transition-colors hover:border-gray-300 dark:hover:border-gray-600'
      >
        {/* <HiGlobeAlt className='w-4 h-4 text-gray-600' /> */}
        <span className='text-xs font-bold'>
          {languages.find((lang) => lang.code === i18n.language)?.name || 'EN'}
        </span>
        <IoIosArrowDown  className='w-3 h-3' />
      </button>

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className='fixed inset-0 z-10' 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Dropdown Menu - Always mounted for smooth animation */}
      <div className={`absolute lg:left-1/2 -right-22 -translate-x-1/2 top-full mt-2 lg:mt-5 w-48 rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 z-20 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className='py-1'>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-2 text-sm !bg-white dark:!bg-slate-800 hover:!bg-gray-100 dark:hover:!bg-slate-700 flex items-center space-x-3 transition-colors ${
                i18n.language === language.code
                  ? 'text-green-500 dark:text-green-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <ReactCountryFlag 
                countryCode={language.flagCode}
                svg
                style={{
                  width: '1.5em',
                  height: '1.5em',
                }}
              />

              <div className='flex flex-col'>
                <span className='font-medium'>{language.fullName}</span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>{language.name}</span>
              </div>
              {i18n.language === language.code && (
                <span className='ml-auto text-green-500 dark:text-green-400'>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;




