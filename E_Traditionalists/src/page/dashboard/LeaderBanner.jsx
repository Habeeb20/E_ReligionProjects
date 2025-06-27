import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import LeaderDetailsModal from './LeaderDetailsModal';
import PaystackPayment from './PaystackPayment';

const LeaderBanner = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentLeader, setPaymentLeader] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        // Fetch leaders
        const leadersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leaders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (leadersRes.data.status && Array.isArray(leadersRes.data.data)) {
          // Filter for Islam religion (case-insensitive)
          const islamLeaders = leadersRes.data.data.filter(
            leader => leader.religion && leader.religion.toLowerCase() === 'traditional'
          );
          setLeaders(islamLeaders);

          // Log filtered Islamic leaders
          console.log('Traditional Leaders Data:', islamLeaders.map(leader => ({
            profile: {
              id: leader._id,
              userEmail: leader.userEmail,
              gender: leader.gender,
              title: leader.title,
              firstname: leader.firstname,
              lastname: leader.lastname,
              address: leader.address,
              bio: leader.bio,
              phoneNumber: leader.phoneNumber,
              religion: leader.religion,
              category: leader.category,
              profilePicture: leader.profilePicture,
              state: leader.state,
              LGA: leader.LGA,
              gallery: leader.gallery,
              accountName: leader.accountName,
              accountNumber: leader.accountNumber,
              bankName: leader.bankName,
              paystackRecipientCode: leader.paystackRecipientCode,
              createdAt: leader.profileCreatedAt,
              updatedAt: leader.profileUpdatedAt,
            },
            user: {
              id: leader.userId,
              email: leader.email,
              role: leader.role,
              createdAt: leader.userCreatedAt,
            },
          })));
        } else {
          throw new Error('Invalid data format from API');
        }

        // Fetch chat sessions
        const sessionsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/chat/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatSessions(sessionsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leaders');
        toast.error(err.response?.data?.message || 'Failed to fetch leaders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleView = (leader) => {
    setSelectedLeader(leader);
    setIsModalOpen(true);
  };

  const handleChat = async (leader) => {
    const hasSession = chatSessions.some(session => session.leaderId?._id === leader._id);
    if (hasSession) {
      navigate(`/chat/${leader._id}`);
    } else {
      setPaymentLeader(leader);
    }
  };

  if (loading) return <p className="text-center text-indigo-900">Loading leaders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen mt-8 bg-butter p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 text-center mt-20">Registered Leaders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {leaders.map((leader) => (
          <div
            key={leader._id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={leader.profilePicture || (leader.gallery && leader.gallery.length > 0 ? leader.gallery[0] : '/default-avatar.png')}
              alt={`${leader.title} ${leader.firstname} ${leader.lastname}`}
              className="w-24 h-24 rounded-full object-cover mb-4"
              onError={(e) => (e.target.src = '/default-avatar.png')}
            />
            <h2 className="text-lg font-bold text-center">{leader.title} {leader.firstname} {leader.lastname}</h2>
            <p className="text-gray-600 text-center text-sm">{leader.email}</p>
            <p className="text-gray-500 text-center text-sm mt-1 capitalize">{leader.role || 'No role'}</p>
            <p className="text-gray-500 text-center text-sm mt-1 truncate max-w-full">
              {leader.bio ? (leader.bio.length > 50 ? `${leader.bio.substring(0, 50)}...` : leader.bio) : 'No bio available'}
            </p>
            <p className="text-gray-500 text-center text-sm mt-1">{leader.phoneNumber || 'No phone number'}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleView(leader)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-600"
              >
                View
              </button>
              <button
                onClick={() => handleChat(leader)}
                className="bg-green-500 text-white py-2 px-4 rounded-md text-sm hover:bg-green-600"
              >
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <LeaderDetailsModal
          leader={selectedLeader}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {paymentLeader && (
        <PaystackPayment
          leader={paymentLeader}
          amount={500000} // ₦5000 in kobo
          onSuccess={() => {
            setChatSessions((prev) => [
              ...prev,
              { _id: `temp-${Date.now()}`, leaderId: paymentLeader, userId: localStorage.getItem('userId'), createdAt: new Date() },
            ]);
            setPaymentLeader(null);
            navigate(`/chat/${paymentLeader._id}`);
          }}
          onClose={() => setPaymentLeader(null)}
        />
      )}
    </div>
  );
};

export default LeaderBanner;