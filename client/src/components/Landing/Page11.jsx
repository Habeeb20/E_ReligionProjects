import React from 'react';
import m from '../../assets/religion/Rectangle 419.png'
import a from '../../assets/religion/Rectangle 326.png'
import b from '../../assets/religion/Rectangle 326 (1).png'
const Page11 = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Advert Section */}
      <div className="bg-gray-300 text-center py-10">
        <h1 className="text-3xl font-bold">Advert</h1>
      </div>

      {/* Promotions Section */}
      <div className="bg-yellow-50 py-10 px-4 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Image */}
          <div className="w-full">
            <img
              src={m}
              alt="Travel"
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>

          {/* Right Side: Text */}
          <div className="flex flex-col justify-center text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-4">
              Students Wooping Discount
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Travel to anywhere in the world at the best discount possible by
              being a student.
            </p>
            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg w-fit text-lg">
              Book now
            </button>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="bg-yellow-50 py-10 px-4 lg:px-16">
        <div className="text-left mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">News</h2>
        </div>

        {/* Top Topic */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Top Topic</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={b}
                  alt="News"
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold">Business News</h4>
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet consectetur. 
                    dictum massa.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More News */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="flex items-center">
              <img
                src={a}
                alt="News"
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h4 className="text-lg font-semibold">Lorem ipsum dolor sit</h4>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur. Et rhoncus nunc dictum
                  massa.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page11;
