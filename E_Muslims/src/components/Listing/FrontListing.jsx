import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FrontListing = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leader-listings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setListings(response.data.data.frontListings || []);
      } catch (error) {
        console.error('Error fetching front listings:', error);
      }
    };
    fetchListings();
  }, []);

  const daysLeft = (start) => {
    if (!start) return null;
    const now = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 30);
    const diff = Math.floor((end - now) / (1000 * 60 * 60 * 24));
    return diff <= 7 && diff > 0 ? diff : null;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Front Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((leader, index) => (
          <div key={index} className="bg-white p-4 rounded-md shadow-md">
            <h3>{leader.title} {leader.firstname} {leader.lastname}</h3>
            <p>Ministry: {leader.ministryname}</p>
            <p>State: {leader.state}</p>
            {daysLeft(leader.subscriptionStart) && (
              <p className="text-red-600 border-t-2 border-red-600 mt-2">
                Expires in {daysLeft(leader.subscriptionStart)} days
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrontListing;