import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Removed unused icons
import im from '../../assets/religion/Rectangle 6.png';
import im1 from '../../assets/religion/Rectangle 7.png';
import im2 from '../../assets/religion/Rectangle 8.png';
import im3 from '../../assets/religion/Rectangle 9.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: '', // Added to initial state
    profilePicture: null, // Added for file input
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Handle input changes, including radio buttons
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'radio' ? value : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors
    if (!formData.role) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }

    try {
      const dataToSend = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      if (formData.profilePicture) {
        dataToSend.profilePicture = formData.profilePicture;
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, dataToSend, {
        headers: { 'Content-Type': 'application/json' }, // Use JSON for now, adjust if backend expects FormData
      });

      if (response.data) {
        navigate(`/verifyemail?email=${encodeURIComponent(formData.email)}&role=${encodeURIComponent(formData.role)}`);
        toast.success('Registration successful! Redirecting to verify email...', {
          style: { background: '#4CAF50', color: 'white' },
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF9E8] mt-7">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#080C89]">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            className="w-full p-2 border rounded"
            onChange={handleInputChange}
            value={formData.firstname}
            required
            disabled={isLoading}
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            className="w-full p-2 border rounded"
            onChange={handleInputChange}
            value={formData.lastname}
            required
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={handleInputChange}
            value={formData.email}
            required
            disabled={isLoading}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              onChange={handleInputChange}
              value={formData.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 top-2"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {!formData.role && <p className="text-red-600 text-center">Please select a role</p>}
          <div className="flex space-x-4 justify-center">
            <h4 className="font-bold">Role:</h4>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleInputChange}
                className="mr-2"
                disabled={isLoading}
              />
              User
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="leader"
                checked={formData.role === 'leader'}
                onChange={handleInputChange}
                className="mr-2"
                disabled={isLoading}
              />
              Leader
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="religious_ground"
                checked={formData.role === 'religious_ground'}
                onChange={handleInputChange}
                className="mr-2"
                disabled={isLoading}
              />
              Religious Ground
            </label>
          </div>
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-800 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <AiOutlineLoading3Quarters className="animate-spin mx-auto" size={24} /> : 'Sign Up'}
          </motion.button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account? <a href="/login" className="text-[#080C89] underline">Sign in</a>
          </p>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          <img src={im} alt="Gallery Image 1" className="w-20 h-20 object-cover" />
          <img src={im1} alt="Gallery Image 2" className="w-20 h-20 object-cover" />
          <img src={im2} alt="Gallery Image 3" className="w-20 h-20 object-cover" />
          <img src={im3} alt="Gallery Image 4" className="w-20 h-20 object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Signup;