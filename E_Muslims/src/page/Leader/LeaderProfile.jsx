import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../ThemeContext';

const LeaderProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [leader, setLeader] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDark } = useTheme();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchLeader = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leader/${slug}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLeader(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leader profile');
        toast.error(err.response?.data?.message || 'Failed to fetch leader profile');
      } finally {
        setLoading(false);
      }
    };
    fetchLeader();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/profile/leader/${slug}/comment`,
        { content: comment, userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setComment('');
      fetchComments();
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/profile/leader/${slug}/like`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchLeader(); // Refresh to update likeCount
    } catch (err) {
      toast.error('Failed to like profile');
    }
  };

  const handleShare = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/profile/leader/${slug}/share`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchLeader(); // Refresh to update shareCount
    } catch (err) {
      toast.error('Failed to share profile');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leader/${slug}/comments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setComments(response.data.data);
    } catch (err) {
      toast.error('Failed to fetch comments');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [slug]);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-900"></div></div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900 text-white' : 'bg-[#f5f0e1] text-gray-900'}`}>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center bg-white md:bg-transparent shadow-md rounded-lg p-6 mb-6">
          <img
            src={leader.profilePicture || '/path-to-default-avatar.jpg'}
            alt={`${leader.firstname} ${leader.lastname}`}
            className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold text-[#1f1f7a]">
              {leader.title} {leader.firstname} {leader.lastname}
            </h1>
            <p className="text-sm text-gray-600">Joined: {new Date(leader.userCreatedAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Last Updated: {new Date(leader.profileUpdatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white md:bg-transparent shadow-md rounded-lg p-6">
          <div>
            <p><strong>Email:</strong> {leader.email}</p>
            <p><strong>Phone:</strong> {leader.phoneNumber || 'N/A'}</p>
            <p><strong>Gender:</strong> {leader.gender}</p>
            <p><strong>Religion:</strong> {leader.religion}</p>
            <p><strong>Category:</strong> {leader.category}</p>
            <p><strong>Unique Number:</strong> {leader.uniqueNumber || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Address:</strong> {leader.address}</p>
            <p><strong>State:</strong> {leader.state}</p>
            <p><strong>LGA:</strong> {leader.LGA}</p>
            <p><strong>Account Name:</strong> {leader.accountName || 'N/A'}</p>
            <p><strong>Account Number:</strong> {leader.accountNumber || 'N/A'}</p>
            <p><strong>Bank:</strong> {leader.bankName || 'N/A'}</p>
            <p><strong>Paystack Code:</strong> {leader.paystackRecipientCode || 'N/A'}</p>
          </div>
        </div>

        {/* Gallery */}
        {leader.gallery.length > 0 && (
          <div className="mt-6 bg-white md:bg-transparent shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <div className="flex space-x-4 overflow-x-auto">
              {leader.gallery.map((img, index) => (
                <img key={index} src={img} alt={`Gallery ${index + 1}`} className="w-32 h-32 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        <div className="mt-6 bg-white md:bg-transparent shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p>{leader.bio || 'No bio available'}</p>
        </div>

        {/* Interactions */}
        <div className="mt-6 bg-white md:bg-transparent shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Interactions</h2>
          <div className="flex space-x-6 mb-4">
            <button onClick={handleLike} className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800">
              <span>Like</span>
              <span>{leader.likeCount || 0}</span>
            </button>
            <button onClick={handleShare} className="flex items-center space-x-2 text-green-600 hover:text-green-800">
              <span>Share</span>
              <span>{leader.shareCount || 0}</span>
            </button>
          </div>
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className={`flex-1 p-2 rounded-lg border ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'}`}
            />
            <button type="submit" className="bg-indigo-900 text-white p-2 rounded-lg">
              Post
            </button>
          </form>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Comments ({leader.commentCount || 0})</h3>
            {comments.map((c) => (
              <div key={c._id} className="mt-2 p-2 bg-gray-100 rounded-lg">
                <p><strong>{c.userId.firstname} {c.userId.lastname}</strong>: {c.content}</p>
                <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderProfile;































