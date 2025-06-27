import React from "react";
import im from '../../assets/religion/Rectangle 419.png'
import re from '../../assets/religion/trad1.jpeg';
import im2 from '../../assets/religion/trad2.jpeg';
import im3 from '../../assets/religion/trad4.jpeg';
const Religion3 = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-cream py-8">
      {/* Container for responsiveness and centering */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Section with image and text */}
        <div className="bg-cream shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="md:w-1/2">
            <img
              src={im}
              alt="Student Discount"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Section */}
          <div className="p-8 flex flex-col justify-center md:w-1/2 bg-cream">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">
              Students Wooping Discount
            </h1>
            <p className="text-gray-700 mt-4">
              Travel to anywhere in the world at the best discount possible by being a student
            </p>
            <button className="bg-indigo-600 text-white px-6 py-3 mt-6 rounded-md hover:bg-indigo-700">
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
      

        {/* Main Content Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4">Traditional</h2>
          <p className="text-gray-600 mb-6">
            Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God...
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>100000 ministers worldwide from the comfort of your home</li>
            <li>Meet with genuine Men of God worldwide</li>
            <li>Comfort of your home and meet with Men of God</li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <img
              src={im2}
              alt="Minister 1"
              className="w-full h-48 object-cover rounded-lg"
            />
            <img
              src={re}
              alt="Minister 2"
              className="w-full h-48 object-cover rounded-lg"
            />
            <img
              src={im3}
              alt="Minister 3"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Icons Section */}
    
      </div>
    </div>
  );
};

export default Religion3;
