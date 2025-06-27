import React from "react";
import f from '../../assets/religion/Frame 550.png'
import m from '../../assets/religion/Rectangle 16.png'
const Page10 = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Promotions Section */}
      <div className="text-left mb-4">
        <h2 className="text-xl font-semibold">Promotions, deals and special offers for you</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="relative bg-gray-100 shadow-lg rounded-lg overflow-hidden">
              <img
                src={f}
                alt="Promotion"
                className="w-full h-48 object-cover"
              />
              {/* <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">Logo</h3>
                <p className="text-white mb-2 font-sm">
                  Get evidence of existence and visibility for every one and friends and family and dissolve
                  every form of doubt by studying on this people...
                </p>
                <button className="bg-white text-black px-2 py-2 rounded-lg font-semibold">
                  EXPLORE MORE
                </button>
              </div> */}
            </div>
          ))}
      </div>

      {/* Groups Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Groups you may like</h2>
          <a href="#" className="text-red-500">See more</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: "Essential staff" },
            { title: "Health group" },
            { title: "Everyday news" },
            { title: "Computer science" },
            { title: "Essential staff" }
          ].map((group, index) => (
            <div key={index} className="bg-yellow-100 p-4 rounded-lg shadow-lg">
              <img
                src={m}
                alt="Group"
                className="w-full h-24 object-cover mb-2"
              />
              <h3 className="text-green-700 font-bold">{group.title}</h3>
              <p className="text-sm">1 Member | 0 Posts today</p>
              <button className="bg-blue-900 text-white px-3 py-2 mt-2 rounded-lg w-full">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page10;
