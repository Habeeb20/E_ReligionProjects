import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import im from '../../assets/religion/Rectangle 6.png';
import im1 from '../../assets/religion/Rectangle 7.png';
import im2 from '../../assets/religion/Rectangle 8.png';
import im3 from '../../assets/religion/Rectangle 9.png';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaTwitter, FaUserCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
 const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, formData, { withCredentials: true });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem("userId", response.data?.userId);
        console.log(response.data?.userId, "user id login")
         const role = response.data.role;
         const message = response.data.message
        toast.success(message, {
          style: { background: "#4CAF50", color: "white", fontSize: "bold" },
        });
              navigate(role === "user" ? "/userdashboard" : role ==="leader" ? "/leaderdashboard" :  role ==="religious_leader" ? "/religiousdashboard" : "/adminDashboard");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      toast.error('Login failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 mt-6">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={handleInputChange}
            required
          />
             <div className="relative">
               <input
           type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={handleInputChange}
            required
          />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 pb-10 flex items-center text-gray-500 top-7"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
                
             </div>
        
          <motion.button
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-emerald-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-blue-800
            hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            focus:ring-offset-gray-900 transition duration-200'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? <AiOutlineLoading3Quarters className='animate-spin mx-auto' size={24} /> : "Login"}
          </motion.button>
        </form>
        <Link to='/forgot-password'>
          <h4 className='p-3 hover:text-indigo-800'>Forgot Password?</h4>
        </Link>
        {/* <div className="mt-6 text-center text-gray-600">or</div> */}

        {/* Social Media Login Section */}
        {/* <div className="flex justify-center gap-4 mt-4">
          <motion.a href="#" className="p-3 bg-[#080C89] rounded-full text-white" whileHover={{ scale: 1.1 }}>
            <FaFacebookF size={20} />
          </motion.a>
          <motion.a href="#" className="p-3 bg-[#080C89] rounded-full text-white" whileHover={{ scale: 1.1 }}>
            <FaTwitter size={20} />
          </motion.a>
          <motion.a href="#" className="p-3 bg-[#080C89] rounded-full text-white" whileHover={{ scale: 1.1 }}>
            <FaGoogle size={20} />
          </motion.a>
        </div> */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account? <Link to="/signup" className="text-[#080C89] underline">Sign up</Link>
          </p>
        </div>
        {/* Image Section (For Bottom Images) */}
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

export default Login;


