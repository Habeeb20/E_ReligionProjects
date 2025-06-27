import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../ThemeContext';

const LeaderPayment = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        console.log('Fetching leader payments from:', `${import.meta.env.VITE_BACKEND_URL}/profile/leader/payments`);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leader/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Leader payments response:', response.data);
        setPayments(response.data.data);
      } catch (err) {
        console.error('Fetch leader payments error:', err.response?.status, err.response?.data);
        setError(err.response?.data?.message || 'Failed to fetch payments');
        toast.error(err.response?.data?.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6">Payment History</h1>
        {payments.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-600 text-sm mb-4">No payments have been made to you yet.</p>
            <Link to="/profile">
              <button className="bg-indigo-900 text-white py-2 px-4 rounded-lg">
                View Profile
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className={`p-4 rounded-lg shadow-md ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={
                      payment.userId.profilePicture ||
                      (payment.userId.gallery && payment.userId.gallery.length > 0
                        ? payment.userId.gallery[0]
                        : '/default-avatar.png')
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    onError={(e) => (e.target.src = '/default-avatar.png')}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {payment.userId.firstname} {payment.userId.lastname}
                    </h3>
                    <p className="text-sm text-gray-500">{payment.userId.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">Amount:</span> ₦{payment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Payment Method:</span> {payment.paymentMethod}
                    </p>
                  </div>
                  <div>
                    {payment.paymentMethod === 'Paystack' && (
                      <p className="text-sm">
                        <span className="font-semibold">Recipient Code:</span>{' '}
                        {payment.paymentDetails.recipientCode}
                      </p>
                    )}
                    {payment.paymentMethod === 'Bank Account' && (
                      <>
                        <p className="text-sm">
                          <span className="font-semibold">Account Name:</span>{' '}
                          {payment.paymentDetails.accountName}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Account Number:</span>{' '}
                          {payment.paymentDetails.accountNumber}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Bank Name:</span>{' '}
                          {payment.paymentDetails.bankName}
                        </p>
                      </>
                    )}
                    {payment.paymentMethod === 'Unknown' && (
                      <p className="text-sm text-red-500">No payment destination details available</p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/leader-chat/${payment.userId._id}`}
                    className="bg-navy-blue-600 text-white py-2 px-4 rounded-md hover:bg-navy-blue-700"
                  >
                    Chat with {payment.userId.firstname}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderPayment;