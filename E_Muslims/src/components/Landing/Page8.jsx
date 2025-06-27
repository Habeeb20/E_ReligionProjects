import React, { useState } from 'react';
import m from '../../assets/religion/thinking.png';
import axios from 'axios';
import toast from 'react-hot-toast';

const Page8 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    religion: '',
    state: '',
    LGA: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleRequest = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ religion: '', state: '', LGA: '', phone: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/request/request-report`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        timeout: 10000,
      });
      toast.success(response.data.message);
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit request';
      console.error('Error submitting request:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code,
      });
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col md:flex-row justify-between items-center p-8">
      {/* Text Section */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
          Can’t find your religion
          <br />
          Book a request
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          We have a vast database of religious gatherings, but we know we might
          not cover everything. Help us improve by submitting a request, and we
          will conduct thorough research to assist you.
        </p>
        <button
          onClick={handleRequest}
          className="bg-indigo-900 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition"
        >
          Make a Request
        </button>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
        <img
          src={m}
          alt="Thinking man"
          className="w-68 h-auto object-contain"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-bold text-indigo-900 mb-4">Submit a Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900"
                  placeholder="e.g., islam"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900"
                  placeholder="e.g., Lagos"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">LGA</label>
                <input
                  type="text"
                  name="LGA"
                  value={formData.LGA}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900"
                  placeholder="e.g., Ikeja"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-900"
                  placeholder="e.g., 08012345678"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-900 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-500"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page8;