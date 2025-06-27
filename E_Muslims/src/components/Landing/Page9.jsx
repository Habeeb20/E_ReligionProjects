import React from "react";
import im from '../../assets/religion/Rectangle 406 (1).png'
import im1 from '../../assets/religion/Rectangle 408 (1).png'
import im2 from '../../assets/religion/Rectangle 409 (2).png'
import im3 from '../../assets/religion/Rectangle 410 (1).png'
const Page9 = () => {
  return (
    <div className="bg-yellow-50 min-h-screen p-8">
      {/* Heading */}
      <h1 className="text-blue-900 text-2xl font-bold mb-6">Book an Hotel before leaving</h1>

      {/* Main Image Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Section */}
        <div className="relative">
          <img
            src={im}
            alt="Main Hotel"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-6">
            {/* <h2 className="text-4xl font-bold mb-2">Thousands of 5-star reviews</h2> */}
            <p className="text-lg mb-4">Thanks to our first-class quality and great value fares...</p>
            <button className="bg-blue-900 text-white px-6 py-3 rounded-md font-semibold">Book now</button>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-gray-200 p-6 rounded-lg flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">
            You will be amazed by what we have prepared for you
          </h3>
          <p className="text-gray-700 mb-4">
            Vestibulum dictum ultrices elit a luctus. Sed in ante ut leo congue posuere at sit amet ligula. 
            Pellentesque eget augue nec nisl sodales blandit sed et sem.
          </p>
          <div className="h-1 w-20 bg-blue-900"></div>
        </div>
      </div>

      {/* Image Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <img
          src={im1}
          alt="Image 1"
          className="w-full h-56 object-cover rounded-lg"
        />
        <img
          src={im3}
          alt="Image 2"
          className="w-full h-56 object-cover rounded-lg"
        />
        <img
          src={im2}
          alt="Image 3"
          className="w-full h-56 object-cover rounded-lg"
        />
        <img
          src={im}
          alt="Image 4"
          className="w-full h-56 object-cover rounded-lg"
        />
      </div>

      {/* Footer Section */}
      <h2 className="text-blue-900 text-lg font-bold">Explore more with essential</h2>
    </div>
  );
};

export default Page9;
