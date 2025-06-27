import React from 'react';

import im from '../../assets/religion/image (1).png'
const Report3 = () => {
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

    

     
    </div>
  );
};

export default Report3;
