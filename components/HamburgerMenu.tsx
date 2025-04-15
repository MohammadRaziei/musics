import React from 'react';

interface HamburgerMenuProps {
  isOpen: boolean;
  toggle: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, toggle }) => {
  return (
    <button 
      onClick={toggle}
      className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <span 
        className={`block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      <span 
        className={`block h-0.5 w-6 bg-white transition duration-300 ease-in-out ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span 
        className={`block h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
    </button>
  );
};

export default HamburgerMenu;