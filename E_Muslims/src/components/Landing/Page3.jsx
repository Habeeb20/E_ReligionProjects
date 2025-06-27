import React from 'react';

import im from '../../assets/religion/image (1).png'
const Page3 = () => {
  const videos = [
    { id: 1, imgSrc: 'https://via.placeholder.com/150', likes: 203, views: '5,345 views' },
    { id: 2, imgSrc: 'https://via.placeholder.com/150', likes: 203, views: '5,345 views' },
    { id: 3, imgSrc: 'https://via.placeholder.com/150', likes: 203, views: '5,345 views' },
    { id: 4, imgSrc: 'https://via.placeholder.com/150', likes: 203, views: '5,345 views' },
  ];

  return (
    <div className="bg-[#FAF3DD] p-6">
    

      {/* Section Title */}
      <h2 className="text-[#0A0344] text-xl text-center mb-6">
        We are majorly known for these 4 things... as we are a professional community as well
      </h2>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-8">
        {[
          { title: 'Connect', description: 'Book a call with a registered Man of God very easily right from the comfort of your home', icon: '🌀' },
          { title: 'Trust', description: 'We don’t just expect you to trust us, you will trust us at will, because we meet up with our words', icon: '🛡️' },
          { title: 'Report', description: 'Book a call with a registered Man of God very easily right from the comfort of your home', icon: '🔔' },
          { title: 'Pay', description: 'You can never be over charged. Pay with your mind at ease', icon: '💳' },
        ].map((feature, index) => (
          <div key={index} className="bg-[#FFF7DC] p-6 rounded-lg shadow-md hover:shadow-xl">
            <div className="text-4xl mb-2">{feature.icon}</div>
            <h3 className="text-[#0A0344] font-semibold mb-2">{feature.title}</h3>
            <p className="text-[#6D6D6D]">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Short Videos Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#0A0344] text-xl font-semibold">Short Videos</h3>
        <button className="text-[#0A0344]">See All</button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="relative">
            <img src={video.imgSrc} alt="video thumbnail" className="w-full h-48 object-cover rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 bg-opacity-60 bg-black text-white p-2 flex justify-between items-center text-sm">
              <span>❤️ {video.likes}</span>
              <span>{video.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page3;
