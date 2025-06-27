import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../ThemeContext';

const LeaderReview = () => {
  const navigate = useNavigate();
  const [interactions, setInteractions] = useState({ comments: [], likes: [], shares: [], likeCount: 0, shareCount: 0, commentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isDark } = useTheme();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        // Validate token and userId
        if (!userId || !token) {
          throw new Error('User ID or token is missing. Please log in again.');
        }

        // Log backend URL for debugging
        console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

        // Fetch profile data
        console.log('Fetching profile from /profile/dashboard');
        const profileResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10-second timeout
        });

        console.log('Profile response:', profileResponse.data.data.profile);

        // Validate profile response
        if (!profileResponse.data.data?.profile?.slug) {
          throw new Error('Profile slug not found in response');
        }

        const slug = profileResponse.data.data.profile.slug;
        console.log(`Fetching interactions for slug: ${slug}`);
        // Fetch interactions

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/leader/${slug}/interactions`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10-second timeout
        });

        console.log('Interactions response:', response.data.data);
        setInteractions(response.data.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch interactions';
        console.error('Error fetching interactions:', {
          message: errorMessage,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className={`pt-16 ${isDark ? 'bg-gray-900 text-white' : 'bg-[#f5f0e1] text-gray-900'}`}>
      <div className="container mx-auto p-4">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white md:bg-transparent shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Likes</h2>
            <p className="text-2xl">{interactions.likeCount}</p>
            <ul>
              {interactions.likes.map((like) => (
                <li key={like._id}>
                  {like.userId?.firstname || 'Unknown'} {like.userId?.lastname || 'User'}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white md:bg-transparent shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Shares</h2>
            <p className="text-2xl">{interactions.shareCount}</p>
            <ul>
              {interactions.shares.map((share) => (
                <li key={share._id}>
                  {share.userId?.firstname || 'Unknown'} {share.userId?.lastname || 'User'}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white md:bg-transparent shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Comments</h2>
            <p className="text-2xl">{interactions.commentCount}</p>
            <ul>
              {interactions.comments.map((comment) => (
                <li key={comment._id}>
                  {comment.userId?.firstname || 'Unknown'} {comment.userId?.lastname || 'User'}: {comment.content}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderReview;