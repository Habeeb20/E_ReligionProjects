import React, { useEffect, useState } from 'react';
import sc from '../../assets/religion/sc.png';
import sc1 from '../../assets/religion/sc1.png';
import sc3 from '../../assets/religion/sc3.png';
import { FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Page4 = () => {
  const [ministers, setMinisters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    complaints: '',
    observations: '',
    dateOfIncident: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ complaints: '', observations: '', dateOfIncident: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formattedData = {
        ...formData,
        dateOfIncident: new Date(formData.dateOfIncident).toISOString(),
      };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/scam/scam-report`, formattedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        timeout: 10000,
      });
      toast.success(response.data.message);
      handleCloseModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit scam report';
      console.error('Error submitting scam report:', {
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

  // Fetch minister data from API
  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/leaders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch ministers');
        const data = await response.json();
        if (data.status) {
          setMinisters(data.data);
        } else {
          console.error('API error:', data.message);
          setMinisters([]);
          toast.error('Failed to load ministers');
        }
      } catch (error) {
        console.error('Error fetching ministers:', error);
        setMinisters([]);
        toast.error('Failed to load ministers');
      }
    };

    fetchMinisters();
  }, []);

  return (
    <div className="bg-indigo-900 text-white min-h-screen flex items-center justify-center px-6 py-12 mt-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-2xl font-bold text-white leading-tight mb-4">
            Serve God Anywhere in the world <br /> and avoid <span className="text-white">SCAMMERS</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-6">
            Connect with over 100000 ministers worldwide from the comfort of your home and meet with genuine Men of God.
          </p>
          <button 
            onClick={handleOpenModal}
            className="bg-white text-blue-900 px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-400">
            Report a scam
          </button>
        </div>
        {/* Image Container */}
        <div className="flex flex-col items-center">
          <img src={sc} alt="Image 1" className="w-32 h-auto mb-2 md:w-60" />
          <div className="flex justify-center w-full">
            <img src={sc1} alt="Image 2" className="w-32 h-auto md:w-40 mx-2 " />
            <img src={sc3} alt="Image 3" className="w-32 h-auto md:w-40 mx-2" />
          </div>
        </div>
      </div>
      {/* Scam Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#0A0344]">Report a Scam</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-black">
                <label className="block text-sm font-medium text-gray-700">Complaints</label>
                <textarea
                  name="complaints"
                  value={formData.complaints}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0344]"
                  rows="4"
                  required
                  placeholder="Describe the scam"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Observations</label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0344]"
                  rows="4"
                  required
                  placeholder="Any additional details"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date of Incident</label>
                <input
                  type="date"
                  name="dateOfIncident"
                  value={formData.dateOfIncident}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A0344]"
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
                  className="bg-[#0A0344] text-white py-2 px-4 rounded-md hover:bg-[#1f1f7a] disabled:bg-gray-500"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page4;