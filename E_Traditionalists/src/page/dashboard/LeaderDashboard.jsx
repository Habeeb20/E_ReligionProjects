import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Dropzone from 'react-dropzone';
import ProfileModal from './ProfileModal'; 
import CustomComponent from './customComponents';
import Logout from '../Logout';
import LeaderPayment from '../chat/LeaderPyament';
import LeaderReview from '../Leader/LeaderReview';
import ListingSelection from '../Leader/ListingSelection';
import FrontListing from '../../components/Listing/FrontListing';
import MostViewedListing from '../../components/Listing/MostViewedListing';
import FeaturedListing from '../../components/Listing/FeaturedListing';


const LeaderDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUser({
          ...response.data.data.user,
          ...response.data.data.profile,
          profilePicture: response.data.data.profile.profilePicture,
          gallery: response.data.data.profile.gallery || [],
          accountName: response.data.data.profile.accountName,
          accountNumber: response.data.data.profile.accountNumber,
          bankName: response.data.data.profile.bankName,
        });
        console.log(response.data.data.profile, "user details")
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized access, please login again');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to fetch dashboard data');
          toast.error('Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  // Open modal for editing
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  // Delete account
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/profile/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Account deleted successfully');
      localStorage.removeItem('token');
      navigate('/signup');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account');
      toast.error('Failed to delete account');
    }
  };

  if (loading) return <p className="text-center text-indigo-900">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!user) return <p className="text-center text-indigo-900">User not found</p>;

  return (
    <div className="min-h-screen bg-butter">
      <div className="bg-indigo-900 p-4 sm:p-8">
        {/* Header */}
      </div>
      <div className="flex flex-col md:flex-row bg-gray-100 p-4 sm:p-8">
        {/* Left Sidebar */}
        <div className="bg-white shadow-md rounded p-4 w-full md:w-1/3 flex flex-col items-center mb-4 md:mb-0">
          {/* {user.profilePicture && ( */}
            <div className="mb-4">
              <img
                src={user.profilePicture ||  (user.gallery && user.gallery.length > 0 ? user.gallery[0] : '/default-avatar.png')}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
              />
            </div>
          {/* )} */}
          <h2 className="text-lg sm:text-xl font-bold text-center">{user.title} {user?.firstname} {user?.lastname}</h2>
          <p className="text-gray-600 text-center text-sm sm:text-base">{user.email}</p>
          <div className="mt-4 sm:mt-8 w-full flex flex-col space-y-2">
            <Link to="/choice">
              {/* <button className="bg-indigo-900 text-white py-2 px-4 rounded-lg w-full text-sm sm:text-base">
                View choices
              </button> */}
            </Link>
            <Link to="/leader-chat">
              <button className="bg-indigo-900 text-white py-2 px-4 rounded-lg w-full text-sm sm:text-base">
                Go to your chat
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section: Profile Details and Tabs */}
        <div className="flex-1 bg-white shadow-md rounded p-4 md:ml-4 sm:ml-8">
          {/* Tabs */}
          <div className="flex flex-wrap border-b">
            {['general', 'account', 'gallery', 'review','payment-history','promote','logout'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-3 sm:px-4 text-sm sm:text-base ${
                  activeTab === tab ? 'text-indigo-900 border-b-2 border-indigo-900' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* General Section */}
          {activeTab === 'general' && (
            <div className="mt-4 sm:mt-6">
              <h1 className="text-lg sm:text-xl font-bold mb-4">General Information</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div>
                  <p className="text-gray-600"><strong>Title:</strong> {user.title}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                  <p className="text-gray-600"><strong>State:</strong> {user.state}</p>
                  <p className="text-gray-600"><strong>LGA:</strong> {user.LGA}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Phone Number:</strong> {user.phoneNumber}</p>
                  <p className="text-gray-600"><strong>Address:</strong> {user.address}</p>
                  <p className="text-gray-600"><strong>Religion:</strong> {user.religion}</p>
                  <p className="text-gray-600"><strong>Category:</strong> {user.category}</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm sm:text-base"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeTab === 'account' && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Account Information</h3>
              <div className="text-sm sm:text-base">
                <p className="text-gray-600"><strong>Account Name:</strong> {user?.accountName || 'N/A'}</p>
                <p className="text-gray-600"><strong>Account Number:</strong> {user?.accountNumber || 'N/A'}</p>
                <p className="text-gray-600"><strong>Bank Name:</strong> {user?.bankName || 'N/A'}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm sm:text-base"
                >
                  Edit Bank Details
                </button>
              </div>
            </div>
          )}

          {/* Gallery Section */}
          {activeTab === 'gallery' && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {user.gallery?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-32 sm:h-40 object-cover rounded"
                  />
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm sm:text-base"
                >
                  Add/Edit Gallery
                </button>
              </div>
            </div>
          )}

          {/* Review Section */}
          {activeTab === 'review' && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Review</h3>
              <LeaderReview />
            </div>
          )}
          {activeTab === 'payment-history' && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Payment history</h3>
              <LeaderPayment />
            </div>
          )}
          {activeTab === 'promote' && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Promote</h3>
              <ListingSelection />
             
            </div>
          )}
          {activeTab === 'logout' && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Logout</h3>
                <Logout />
            </div>
          )}

          {/* Imported Component Section */}
          <div className="mt-4 sm:mt-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Custom Content</h3>
            <CustomComponent />
          </div>
        </div>
      </div>

      {/* Delete Account Button */}
      <div className="flex justify-center mt-4 sm:mt-6">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedData) => {
            setUser({ ...user, ...updatedData });
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default LeaderDashboard;