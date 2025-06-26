import  { useState } from 'react';
import { Link } from 'react-router-dom';
// import logo from './../assets/logo eriligion.png'
import logo from './../assets/religion.png'

const Navbar = () => {
  const [activePage, setActivePage] = useState('Home');
  const [isOpen, setIsOpen] = useState(false);



  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'About us', link: '/about' },
    { name: 'Religion', link: '/religion' },
    { name: 'Report', link: '/report' },
    { name: 'Login', link: '/login' },
    { name: 'Blacklist', link: '/blacklist' },
  ];

  return (
    <>
     <nav className="bg-indigo-900 text-white fixed top-0 w-full z-50 shadow-lg   ">
      <div className="container mx-auto flex justify-between items-center py-1 px-6 m-1">
      <Link to="/">
            <img
              src={logo}
              alt="e-religion logo"
              className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </Link>
        {/* <h1 className="text-2xl font-bold text-white">e-religion</h1> */}

        {/* Mobile hamburger menu */}
        <button
          className="text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {/* Hamburger icon */}
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              to={item.link}
              key={item.name}
              className={`py-2 px-4 rounded ${
                activePage === item.name
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white hover:text-black'
              }`}
              onClick={() => setActivePage(item.name)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu (toggleable) */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-indigo-900 px-6 space-y-2 pb-4">
          {navItems.map((item) => (
            <Link
              to={item.link}
              key={item.name}
              className={`py-2 px-4 rounded ${
                activePage === item.name
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white hover:text-black'
              }`}
              onClick={() => {
                setActivePage(item.name);
                setIsOpen(false); // Close the menu after selecting a page
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    
    </nav>

   
    


    </>
   
  );
};

export default Navbar;
