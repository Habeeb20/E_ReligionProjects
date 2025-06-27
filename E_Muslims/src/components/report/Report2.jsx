import React from 'react';

const pastors = [
  {
    name: 'Pst. James Johnson',
    church: 'Body of Christ Church',
    image: 'https://via.placeholder.com/50', // Replace with the actual image URL
    blacklistSymbol: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Red_X.svg/1200px-Red_X.svg.png' // Red X symbol
  },
  // Repeat for as many as you want
];

const Report2 = ({ pastor }) => (
  <div className="border-2 border-red-500 p-4 rounded-lg flex items-center space-x-4 w-full md:w-80">
    <div className="relative">
      <img
        src={pastor.image}
        alt={pastor.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <img
        src={pastor.blacklistSymbol}
        alt="Blacklist"
        className="absolute top-0 left-0 w-5 h-5 -mt-2 -ml-2"
      />
    </div>
    <div>
      <h3 className="text-lg font-bold text-blue-900">{pastor.name}</h3>
      <p className="text-sm text-gray-600 flex items-center">
        <span className="inline-block mr-1">
          {/* Add church icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-blue-900"
          >
            <path d="M12 2l-6 6v6h2v-4h8v4h2v-6l-6-6zm-3 13h6v7h-6v-7z" />
          </svg>
        </span>
        {pastor.church}
      </p>
    </div>
  </div>
);

const App = () => {
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-wrap justify-center items-center space-x-4 space-y-4 py-8 px-4">
      {pastors.map((pastor, index) => (
        <PastorCard key={index} pastor={pastor} />
      ))}
    </div>
  );
};

export default Report2;
