import React from 'react';
import im from "../../assets/religion/blacklist.png"
import im2 from "../../assets/religion/blacklist2.png"
const Report1 = () => {
  return (
    <div className="flex flex-col items-center bg-yellow-50 py-10 min-h-screen mt-5">
      {/* Header Section */}
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 text-center">
        Help us keep you safe
      </h1>
      <p className="text-md md:text-lg text-blue-900 mb-6 text-center max-w-lg">
        Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God
      </p>

      {/* Image Section */}
      <div className="w-full max-w-2xl mb-8 relative">
        <img
          src={im2}
          alt="People in blacklist"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex justify-center items-center w-full">
          <img
            src={im}
            alt="Blacklist"
            className="w-1/2 md:w-1/3 opacity-90"
          />
        </div>
      </div>

      {/* Warning Text */}
      <h3 className="text-lg md:text-xl font-semibold text-blue-900 mb-6">
        Don’t fall into the hands of these people
      </h3>

      {/* Search Section */}
      <div className="flex items-center justify-center space-x-2">
        <input
          type="text"
          placeholder="Search our vast database"
          className="w-80 md:w-96 px-4 py-2 border-2 border-blue-900 rounded-lg text-md focus:outline-none"
        />
        <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
          Search
        </button>
      </div>
    </div>
  );
};

export default Report1;
