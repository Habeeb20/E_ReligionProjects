


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ListingSelection = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leader-listings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const userListing = response.data.data.frontListings.concat(response.data.data.featuredListings, response.data.data.mostViewedListings)
          .find(l => l.email === userEmail);
        if (userListing) {
          setSelectedListing(userListing.listingType);
        }
        // Fetch user details including payment history (assuming a separate endpoint)
        const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/user/${userEmail}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPaymentHistory(userResponse.data.paymentHistory || []);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };
    fetchPaymentHistory();
  }, [userEmail]);

  const handleSelect = async (type) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile/select-listing`, { listingType: type }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      window.location.href = response.data.redirectUrl; // Redirect to Paystack
    } catch (error) {
      console.error('Error selecting listing:', error);
      toast.error('Failed to initiate payment with Paystack.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Select Listing Type</h2>
      <div className="space-y-4">
        {[
          { type: 'front', price: 30000, label: 'Front Listing (30,000 NGN/month)' },
          { type: 'featured', price: 20000, label: 'Featured Listing (20,000 NGN/month)' },
          { type: 'mostViewed', price: 10000, label: 'Most Viewed Listing (10,000 NGN/month)' },
        ].map((listing) => (
          <button
            key={listing.type}
            onClick={() => handleSelect(listing.type)}
            className={`w-full p-3 rounded-md text-white ${selectedListing === listing.type ? 'bg-indigo-600' : 'bg-indigo-500'} hover:bg-indigo-700 transition`}
            disabled={loading || selectedListing}
          >
            {listing.label}
          </button>
        ))}
      </div>
      <h3 className="text-lg font-semibold mt-6 text-gray-700">Payment History</h3>
      {paymentHistory.length > 0 ? (
        <ul className="list-disc pl-5 mt-2">
          {paymentHistory.map((payment, index) => (
            <li key={index} className="text-gray-600">
              {new Date(payment.date).toLocaleDateString()} - {payment.amount} NGN - {payment.status}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mt-2">No payment history available.</p>
      )}
    </div>
  );
};

export default ListingSelection;