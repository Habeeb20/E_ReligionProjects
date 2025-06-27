import React from 'react';
import m from '../../assets/religion/image 1.png'
const Religion1 = () => {
  return (
    <div className="bg-yellow-50 min-h-screen p-8">
      {/* Section 1: Main Title and Text */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
        <div className="lg:w-1/2 text-left">
          <h1 className="text-2xl lg:text-2xl font-bold text-blue-900 mb-6 mt-4">
            Religions in Africa is our source of connection. We have average 4 religions in Africa
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God. 
            Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
            Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
          </p>
        </div>

        {/* Section 1: Image */}
        <div className="lg:w-1/2">
          <img
            src={m}
            alt="Map of Africa"
            className="w-68 h-auto object-cover mt-6"
          />
        </div>
      </div>

      {/* Section 2: Religion Category */}
      {/* <div className="text-left mb-6">
        <h2 className="text-2xl lg:text-4xl font-bold text-blue-900 mb-4">
          Christian
        </h2>
        <p className="text-lg text-gray-700">
          Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
          Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
          Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
        </p>
      </div> */}
    </div>
  );
};

export default Religion1;
