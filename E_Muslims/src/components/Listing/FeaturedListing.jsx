import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeaturedListing = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leader-listings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setListings(response.data.data.featuredListings || []);
      } catch (error) {
        console.error('Error fetching featured listings:', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Featured Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((leader, index) => (
          <div key={index} className="bg-white p-4 rounded-md shadow-md">
            <h3>{leader.title} {leader.firstname} {leader.lastname}</h3>
            <p>Ministry: {leader.ministryname}</p>
            <p>State: {leader.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedListing;