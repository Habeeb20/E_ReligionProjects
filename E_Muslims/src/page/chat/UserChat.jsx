import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserChat = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/chat/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatSessions(response.data.data);
      } catch (err) {
        setError('Failed to fetch chats');
        toast.error('Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  if (loading) return <p className="text-center text-indigo-900">Loading chats...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-butter p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-6">Your Chats</h1>
      {chatSessions.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            You haven't paid to chat with any leader yet.
          </p>
          <Link to="/choice">
            <button className="bg-indigo-900 text-white py-2 px-4 rounded-lg">
              View Leaders to Chat
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {chatSessions.map((session) => (
            <Link
              key={session._id}
              to={`/chat/${session.leaderId?._id}`}
              className="bg-white shadow-md rounded-lg p-4 flex items-center"
            >
              <img
                src={session.leaderId?.profilePicture || (session.leaderId?.gallery && session.leaderId?.gallery.length > 0 ? session.leaderId.gallery[0] : '/default-avatar.png')}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{session.leaderId.title} {session.leaderId.firstName} {session.leaderId.lastName}</h3>
                <p className="text-gray-500 text-sm">Paid on: {new Date(session.createdAt).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserChat;