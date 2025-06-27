import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-indigo-900 h-90 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg text-white font-semibold mb-4">About Us</h3>
            <p className="text-sm text-white">
              We are dedicated to connecting you with religious grounds and ministers across Nigeria. Join us in celebrating faith and community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm text-gray-300 hover:text-white transition">About</a></li>
              <li><a href="/services" className="text-sm text-gray-300 hover:text-white transition">Services</a></li>
              <li><a href="/contact" className="text-sm text-gray-300 hover:text-white transition">Contact</a></li>
              <li><a href="/privacy" className="text-sm text-gray-300 hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg text-white font-semibold mb-4">Contact Us</h3>
            <p className="text-sm text-gray-300">Email: essential@gmail.com</p>
            <p className="text-sm text-gray-300">Phone: +234 801 234 5678</p>
            <p className="text-sm text-gray-300">Address: 123 Faith Road, Lagos, Nigeria</p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 2.6 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.327 3.607 1.302.974.974 1.24 2.241 1.302 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.327 2.633-1.302 3.607-.974.974-2.241 1.24-3.607 1.302-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.327-3.607-1.302-.974-.974-1.24-2.241-1.302-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.327-2.633 1.302-3.607.974-.974 2.241-1.24 3.607-1.302 1.266-.058 1.646-.07 4.85-.07m0-2.163C8.736 0 8.332.012 7.05.07 5.783.128 4.51.393 3.54 1.363 2.57 2.333 2.306 3.607 2.248 4.874.19 6.146 0 6.55 0 12s.19 5.854.248 7.126c.058 1.267.322 2.546 1.292 3.616.97.97 2.349 1.234 3.61 1.292 1.272.058 1.676.07 6.99.07s5.718-.012 6.99-.07c1.261-.058 2.54-.322 3.61-1.292.97-.97 1.234-2.349 1.292-3.61.058-1.272.07-1.676.07-6.99s-.012-5.718-.07-6.99c-.058-1.261-.322-2.54-1.292-3.61-.97-.97-2.349-1.234-3.61-1.292C17.668.19 17.264 0 12 0zm0 5a7 7 0 100 14 7 7 0 000-14zm0 2a5 5 0 110 10 5 5 0 010-10zm6.5-.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-white text-sm ">
          <p className='text-white'>&copy; {new Date().getFullYear()}  All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;