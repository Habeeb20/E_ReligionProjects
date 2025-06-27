import React, { useEffect, useState } from 'react';
import axios from 'axios';
import im from '../../assets/religion/Container (1).png';
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Page6 = () => {
  const [ministers, setMinisters] = useState([]);

  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leaders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.status && Array.isArray(response.data.data)) {
          // Filter for Islam religion (case-insensitive)
          const islamMinisters = response.data.data.filter(
            minister => minister.religion && minister.religion.toLowerCase() === 'christianity'
          );
          setMinisters(islamMinisters);
          console.log(islamMinisters, "Islamic leaders details");
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (error) {
        console.error('Error fetching ministers:', error);
        toast.error('Failed to load ministers. Please try again later.');
        setMinisters([]);
      }
    };

    fetchMinisters();
  }, []);

  const MinisterCard = ({ minister }) => {
    const {
      title = 'Rev.',
      firstname = 'Unknown',
      lastname = 'User',
      bio = 'No bio available',
      religion = 'N/A',
      ministryname = 'N/A',
      phoneNumber = 'N/A',
      email = 'N/A',
      profilePicture = im,
      yearsInProfession = 'N/A',
      state = 'N/A',
      LGA = 'N/A',
      address = 'N/A',
      slug = 'N/A',
    } = minister;

    const userEmail = "user@example.com"; // Replace with dynamic user email if available

    return (
      <div className="border rounded-md p-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out">
        <div className="flex items-center mb-4 relative">
          <img
            src={profilePicture || im}
            alt={`${firstname} ${lastname}`}
            className="w-16 h-16 rounded-full mr-4"
            onError={(e) => { e.target.src = im; }} // Fallback image on error
          />
          <div>
            <div className="absolute top-2 right-2 bg-[#E5E6E9] text-gray-600 text-xs px-2 py-1 rounded-full">
              20mins response time
            </div>
            <h2 className="text-xl font-bold text-gray-800">{`${title} ${firstname} ${lastname}`}</h2>
            <p className="text-gray-500">{ministryname || "none for now"}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-2">bio: {bio}</p>
        <p className="text-gray-700 mb-2">phone num: {phoneNumber}</p>
        <p className="text-gray-500 mb-2">years of being a/an {title}: {yearsInProfession} years</p>
        <p className="text-gray-500 mb-2">state: {state}</p>
        <p className="text-gray-500 mb-2">LGA: {LGA}</p>
        <p className="text-gray-500 mb-2">Address: {address}</p>
        <p className="text-gray-500 mb-2">religion: {religion}</p>
        <span className="flex items-center mb-4">
          <FaEnvelope className="text-gray-600 mr-2" />
          <a href={`mailto:${email}?cc=${userEmail}`} className="text-blue-500 hover:underline">
            {email}
          </a>
        </span>
        <Link
          to={`/leader/${slug}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          View More
        </Link>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          QUICKLY CONNECT
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Connect with Christians Servants of God on a click
        </p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Related Christian Leaders around you</h2>
        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
          <span className="bg-red-500 w-4 h-4 rounded-full inline-block mr-2"></span>
          {/* <span className="text-gray-700">Lagos</span> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {ministers.length > 0 ? (
          ministers.map((minister, index) => (
            <MinisterCard key={index} minister={minister} />
          ))
        ) : (
          <p className="text-center text-gray-600">No Islamic ministers available.</p>
        )}
      </div>
    </div>
  );
};

export default Page6;